const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const CommentSchema = new mongoose.Schema({
    username: {
      type: String,
      required:true
    },
    content:{
      type:String,
      required:true
    },
    post:{
      type:Schema.ObjectId,
      ref:'Post'
    },
    likes:{
      type:Array,
      default:[]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
