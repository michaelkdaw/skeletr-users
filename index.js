var debug = require('debug')('skeletr:users');
var passport = require('passport');

module.exports = function(app,mongoose){
  debug('entering users module');

  var userSchema = mongoose.Schema({
    username: String,
    provider: String
  });

  var UserModel = mongoose.model('User',userSchema);

require('./config/passport')(app,UserModel);


  app.post('/api/login',function(req,res,next){
    var auth = passport.authenticate('local', function(err,user){
      debug('user: ' + JSON.stringify(user));
      if(err){
        return next(err);
      }
      if(!user){
        res.status(401);
        res.send({success: false})
      }
      req.logIn(user,function(err){
        if(err){
          return next(err);
        }
        var responseUser = user;
        responseUser.password = '';
        console.dir(responseUser);
        res.status(200);
        res.send({success:true, user:responseUser});
      });
    });
    auth(req,res,next);
  });

};