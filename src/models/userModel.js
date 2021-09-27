const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
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
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
