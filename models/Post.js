var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

// creating a new schema for post of user
var postSchema = new Schema({
  post: { type: String, required: true, },
  author: Schema.Types.ObjectId,
  username: {type: String, required: true, }

});

module.exports=mongoose.model('post',postSchema);
