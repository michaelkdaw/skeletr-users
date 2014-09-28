var passport = require('passport');
var LocalStrategy = require('passport-local');

module.exports = function(app,UserModel){

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    function(username,password,done){
      UserModel.findOne({username: username}).exec(function(err,user){
        if(user && user.authenticate(password)){
          return done(null,user);
        } else {
          return done(null,false);
        }
      });
    }
  ));

  passport.serializeUser(function(user,done){
    if(user){
      done(null,user._id);
    }
  });

  passport.deserializeUser(function(id,done){
    UserModel.findOne({_id:id}).exec(function(err,user){
      if(user){
        return done(null,user);
      } else {
        return done(err,false);
      }
    })
  });

  return passport;

};