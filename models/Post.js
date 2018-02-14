var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var postSchema = new Schema({
  post: { type: String, required: true, },
  author: Schema.Types.ObjectId
});




module.exports=mongoose.model('post',postSchema);
