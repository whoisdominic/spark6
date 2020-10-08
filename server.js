const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const Axios = require("axios");

const whitelist = ["http://127.0.0.1:5500"];

const corsOptions = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

//////////////////////////
// Middleware
//////////////////////////

app.use(cors(corsOptions)); // cors middlewear, configured by
app.use(express.json());
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to Spar6 Challenge" });
});

app.get("/getPosts", async (req, res) => {
  try {
    var config = {
      method: "get",
      url: "https://jsonplaceholder.typicode.com/posts",
    };
    const postsRequest = await Axios(config);
    const allPosts = await postsRequest.data;

    const getComments = async (id) => {
      var config = {
        method: "get",
        url: `http://jsonplaceholder.typicode.com/comments?postId=${id}`,
      };
      const commentsRequest = await Axios(config);
      return commentsRequest.data;
    };
    for (let post of allPosts) {
      post["comments"] = await getComments(post.id);
    }

    res.status(200).json(allPosts);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(PORT, () => {
  console.log("listening on PORT " + PORT);
});
