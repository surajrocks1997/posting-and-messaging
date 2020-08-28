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
    res.status(500).json({
      message: "Failed. Please Try Again Later",
    });
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
      creator: req.userData.userId,
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
      res.status(500).json({
        message: "Server Error",
      });
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
      creator: req.userData.userId,
    });
    try {
      const result = await Post.updateOne(
        { _id: req.params.id, creator: req.userData.userId },
        post
      );
      if (result.n > 0) {
        res.status(200).json({
          message: "Post Successfully Updated!",
        });
      } else {
        res.status(400).json({
          message: "Denied",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const result = await Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
    });
    if (result.n > 0) {
      res.status(200).json({ message: "Post successfully Deleted" });
    } else {
      res.status(400).json({
        message: "Denied",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post) {
      res.status(200).json(post);
    } else {
      res.send(404).json({ message: "Post Not Found!!!" });
    }
  } catch (error) {
    res.send(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
