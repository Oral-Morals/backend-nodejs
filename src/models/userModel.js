const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true
  },
  email: {
    type:String,
    required:true,
    max:50,
    unique:true
  },
  password: {
    type:String,
    required:true,
    min:6,
  },
  profilePicture:{
    type:String,
    default: ""
  },
  followers: {
    type:Array,
    default:[]
  },
  following: {
    type:Array,
    default:[]
  },
  role:{
    type: String,
    enum: ["curator", "admin", "user"],
    default: "user",
  },
  desc:{
    type: String,
    max:50
  },
  city:{
    type:String,
    max:50
  },
  from:{
    type:String,
    max:50
  }
},
{ timestamps:true }
);

module.exports = mongoose.model("User", UserSchema);
