const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    likes: {
      type: Schema.Types.ObjectId,
      ref: "Likes",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
