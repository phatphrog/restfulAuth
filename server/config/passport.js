// Import passport, strategies, and config
const passport = require('passport'),
      User = require('../models/user'),
      config = require('./main'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local')

//tell passport we have opted to use email field rather than the username field
const localOptions = { usernameField: 'email' };

//Setting up the local login strategy (look at the Passport docs for more info on how this works)
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({email: email}, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

    user.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err); }
      if(!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

      return done(null, user);
    });
  });
});

//setup JWT authentication options
const jwtOptions = {
  //telling passport to check authentication headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  //telling passport where to find the Secret
  secretOrKey: config.secret
};

//setup JWT login strategy and pass options through
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload._id, function(err, user) {
    if(err) {
      return done(err, false);
    }

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//finally allow passport to use the strategies we defined
passport.use(jwtLogin);
passport.use(localLogin);
