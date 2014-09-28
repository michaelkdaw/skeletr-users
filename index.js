var debug = require('debug')('skeletr:users');
var local = require('./lib/local');

module.exports = function(app,mongoose){
  debug('entering users module');

  require('./models/users')(mongoose);

  var UserModel = mongoose.model('User');
  require('./config/passport')(app,UserModel);

  var localStrategy = new local(UserModel);
  app.post('/api/login',localStrategy.authenticate);
  app.post('/api/signup',localStrategy.signUp);
  app.post('/api/logout',localStrategy.logout);

  this.localService = localStrategy;
};