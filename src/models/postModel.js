const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required:true
  },
  desc:{
    type:String,
    max:500
  },
  img:{
    type:String
  },
  likes:{
    type:Array,
    default:[]
  },
  comments:{
    type:Schema.ObjectId,
    ref:'Comments'
  }
},
  { timestamps: true }
  );

module.exports = mongoose.model("Post", PostSchema);
