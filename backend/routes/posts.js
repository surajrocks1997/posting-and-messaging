const express = require("express");
const multer = require("multer");

const Post = require("../models/Post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid MIME Type");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

router.get("", async (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  try {
    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const documents = await postQuery;
    const count = await Post.count();
    res.status(200).json({
      message: "Posts Fetching Successful",
      posts: documents,
      totalPosts: count,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imagePath: url + "/images/" + req.file.filename,
    });
    try {
      const addedPost = await post.save();
      res.status(201).json({
        message: "Post Added Successfully",
        post: {
          id: addedPost._id,
          title: addedPost.title,
          content: addedPost.content,
          imagePath: addedPost.imagePath,
        },
      });
    } catch (error) {
      console.log("ERROR: " + error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    const result = await Post.updateOne({ _id: req.params.id }, post);
    res.status(200).json({
      message: "Post Successfully Updated!",
    });
  }
);

router.delete("/:id", checkAuth, async (req, res) => {
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
