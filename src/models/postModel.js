const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    img: {
      type: String,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
