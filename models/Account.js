var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
})

accountSchema.pre('save',function(next){
  var account= this;
  bcrypt.genSalt(10,function(error,salt){
    bcrypt.hash(account.password,salt,function(e,hash){
      account.password=hash;
        next();
    });
  });
});

accountSchema.methods.compare = function(pw){
  return bcrypt.compareSync(pw,this.password);
}

module.exports=mongoose.model('account',accountSchema);
