const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Schema.ObjectId,
      ref: "Comments",
    },
    caption: {
      type: String,
      max: 300,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
