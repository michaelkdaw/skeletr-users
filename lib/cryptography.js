var crypto = require('crypto');

module.exports = function(){

  this.createSalt = function(){
    return crypto.randomBytes(128).toString('base64');
  };

  this.hashPassword = function(salt, password){
    var hmac = crypto.createHmac('sha1',salt);
    hmac.setEncoding('hex');
    hmac.write(password);
    hmac.end();
    hash = hmac.read();
    return hash;
  }
};