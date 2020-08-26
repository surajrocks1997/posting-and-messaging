const express = require("express");
const app = express();

const connectDB = require("./db");

connectDB();

const Post = require("./models/Post");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API RUNNING"));

app.get("/api/posts", async (req, res) => {
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

app.post("/api/posts", async (req, res) => {
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

app.put("/api/posts/:id", async (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  const result = await Post.updateOne({ _id: req.params.id }, post);
  console.log(result);
  res.status(200).json({
    message: "Post Successfully Updated!",
  });
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post successfully Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.send(404).json({ message: "Post Not Found!!!" });
  }
});

app.listen(3000, () => console.log("Listening on Port 3000"));
