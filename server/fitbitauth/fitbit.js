module.exports = exports = function(app, passport) {

var FitbitStrategy = require('passport-fitbit').Strategy;
var utils = require('./fitbitUtils.js');

//TEMPORARY
var User = require('./TEMPmodel.js');

// Passport credential configs from being a developer
var FITBIT_CONSUMER_KEY = '8cda22173ee44a5bba066322ccd5ed34';
var FITBIT_CONSUMER_SECRET = '12beae92a6da44bab17335de09843bc4';

// Create a new Fitbit API client
var fitbitClient = new utils.FitbitAPIClient(FITBIT_CONSUMER_KEY, FITBIT_CONSUMER_SECRET);

// The Fitbit authentication strategy authenticates users using a Fitbit account and OAuth tokens. 
// The strategy requires a verify callback, which accepts these credentials and calls done 
// providing a user, as well as options specifying a consumer key, consumer secret, and callback URL.
passport.use(new FitbitStrategy({
    consumerKey: FITBIT_CONSUMER_KEY,
    consumerSecret: FITBIT_CONSUMER_SECRET,
    callbackURL: "/auth/fitbit/callback"
  },
  function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
      User.findOne({
        originalId: profile.id,
        provider: profile.provider
      }, function (err,foundUser) {
        if (foundUser) { done(null, foundUser);} 
        else {
          var newUser = new User({
            originalId: profile.id,
            provider: profile.provider,
            token: token,
            tokenSecret: tokenSecret
          });
          newUser.save(function (err, savedUser) {
            if (err) { throw err;}
            console.log("New user: " + savedUser);
            // Subscribe the new user so we get all future notifications
            utils.subscribeUser(savedUser.originalId, function() {
              done(null, savedUser);
            });
          });
        }
      });
    });
  }
));

// This returns identifying information to recover the user account on any subsequent request,
// specifically the second parameter of the done() method is the information serialized into 
// the session data
passport.serializeUser(function (user, done) {
  done(null, user.originalId);
});

// Deserialize returns the user profile based on the identifying information that was serialized 
// to the session
passport.deserializeUser(function (id, done) {
  User.findOne({originalId: id}, function (err, user) {
    done(err, user);
  });
});


};