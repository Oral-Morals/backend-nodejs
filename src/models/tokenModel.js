const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  expired: {
    type: Boolean,
    default: false,
  },
  expiresIn: {
    type: Date,
  },
  token: {
    type: String,
  },
  tokenType: {
    type: String,
  },
});

exports.TokenModel = mongoose.model("Token", tokenSchema);
