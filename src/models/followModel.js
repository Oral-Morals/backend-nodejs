const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema(
  {
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follow", FollowSchema);
