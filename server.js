const express = require("express");
const app = express();
const PORT = 3000;
const Axios = require("axios");

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
