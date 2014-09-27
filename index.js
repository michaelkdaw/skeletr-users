var debug = require('debug')('skeletr:users');
var local = require('./lib/local');

module.exports = function(app,mongoose){
  debug('entering users module');

  var userSchema = mongoose.Schema({
    username: String,
    provider: String
  });

  var UserModel = mongoose.model('User',userSchema);

require('./config/passport')(app,UserModel);


app.post('/api/login',local.authenticate);

};