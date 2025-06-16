const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  fname: String,
  lname: String,
  posts: [{ type: ObjectId, ref: 'Post' }]  // Reference to posts
});

const Post = new Schema({
  question: String,
  content: String,
  User: { type: ObjectId, ref: 'User' },  // Reference to user
  createdAt: { type: Date, default: Date.now }
});

  const UserModel = mongoose.model("User", User, "User");
const PostModel = mongoose.model("Post", Post, "Post");

module.exports = {
  UserModel,
  PostModel
};
