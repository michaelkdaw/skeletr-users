var debug = require('debug')("skeletr:users");
var crypto = require('../lib/cryptography');

module.exports = function(mongoose){

  var userSchema = mongoose.Schema({
    username: String,
    provider: String,
    salt: String,
    hashed_pwd: String
  });

  var hasher = new crypto();

  userSchema.methods = {
    authenticate: function(password){
      return hasher.hashPassword(this.salt, password) ===
        this.hashed_pwd;
    }
  };



  mongoose.model('User',userSchema);
};
