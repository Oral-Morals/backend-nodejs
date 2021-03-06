const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likes",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
    caption: {
      type: String,
      max: 300,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    mediaLinks: {
      type: Object,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
