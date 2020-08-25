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
    await post.save();
    res.status(201).json({
      message: "Post Added Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => console.log("Listening on Port 3000"));
