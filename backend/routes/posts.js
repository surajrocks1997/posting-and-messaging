const express = require("express");

const Post = require("../models/Post");

const router = express.Router();

router.get("", async (req, res) => {
  try {
    const documents = await Post.find();
    res.status(200).json({
      message: "Posts Fetching Successful",
      posts: documents,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("", async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
  });
  try {
    const addedPost = await post.save();
    res.status(201).json({
      message: "Post Added Successfully",
      post: addedPost,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", async (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  const result = await Post.updateOne({ _id: req.params.id }, post);
  res.status(200).json({
    message: "Post Successfully Updated!",
  });
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post successfully Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.send(404).json({ message: "Post Not Found!!!" });
  }
});

module.exports = router;
