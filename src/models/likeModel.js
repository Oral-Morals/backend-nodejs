const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    leader: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
