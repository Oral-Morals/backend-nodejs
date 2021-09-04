const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    userId: {
      type: Schema.ObjectId,
      ref:"User"
    },
    posts:{
      type:Schema.ObjectId,
      ref:"Post"
    },
    likes:{
      type:Array,
      default:[]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
