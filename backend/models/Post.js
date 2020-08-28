const mongoose = require("mongoose");
const User = require("./User");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

module.exports = Post = mongoose.model("Post", postSchema);
