var debug = require('debug')('skeletr:users');
var passport = require('passport');
var crypto = require('./cryptography');

module.exports = function(UserModel) {

  var tempCurrentUser ={};
  this.currentUser = {};

  this.logout = function(req,res,next){
    req.logout();
    res.status(200);
    res.send({success: true});
  };

  this.authenticate = function (req, res, next) {
    var auth = passport.authenticate('local', function (err, user) {
      debug('user: ' + JSON.stringify(user));
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401);
        res.send({success: false})
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        user.hashed_pwd = undefined;
        user.salt = undefined;
        res.status(200);
        res.send({success: true, user: user});
      });
    });
    auth(req, res, next);
  };

  this.signUp = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    debug('submitted username: ' + username);
    debug('submitted password: ' + password);
    if (!username || !password) {
      debug('invalid username or password');
      res.status(401);
      res.send('Incorrect username or password');
    } else {
      UserModel.findOne({username: username}).exec(function (err, result) {
        debug('Checking for user: ' + username);
        if (!result) {
          debug('Username available. Creating user.');
          var user = new UserModel({
            username: username,
            provider: 'local'
          });
          var cryptography = new crypto();
          var salt = cryptography.createSalt();
          var hashedPassword = cryptography.hashPassword(salt, password);
          user.salt = salt;
          user.hashed_pwd = hashedPassword;
          user.save(function (err) {
            if (err) {
              res.status(500);
              res.send('Could not save user');
            } else {
              res.status(200);
              user.hashed_pwd = undefined;
              user.salt = undefined;
              res.send({success: true, user: user});
            }
          })
        } else {
          debug('User already exists.');
          res.status(409);
          res.send('Username already exists');
        }
      });
    }
  };
};
