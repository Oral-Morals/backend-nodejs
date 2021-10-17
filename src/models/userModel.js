const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      max: 100,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    username: {
      type: String,
      min: 3,
      max: 15,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: Object,
      default: {},
    },
    postCount: {
      type: Number,
      default: 0
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["curator", "admin", "user"],
      default: "user",
    },
    heritage: {
      type: Array,
      default: [],
    },
    language: {
      type: Array,
      default: [],
    },
    bio: {
      type: String,
      default: null,
      max: 160,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
