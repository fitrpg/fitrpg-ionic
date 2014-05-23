module.exports = exports = function(app,passport) {
  var JawboneStrategy = require('passport-jawbone').Strategy;
  var jawbone = require('jawbone-up');

  var JAWBONE_CLIENT_ID = 'FdNCRVpJNW4';
  var JAWBONE_CLIENT_SECRET = '9bfce3019e13d6fd775904455df5540873403e7c';

  var jawbone = new JawboneStrategy({
    clientID: JAWBONE_CLIENT_ID,
    clientSecret: JAWBONE_CLIENT_SECRET,
    callbackURL: "https://fitbitgamify.azurewebsites.net/FitbitRPG"
    },
    function(accessToken,refreshToken,profile,done) {
      console.log('Token: ', accessToken);
      console.log('TokenSecret: ', refreshToken);
      console.log(profile);

      var options = {
        access_token: accessToken,
        client_secret: JAWBONE_CLIENT_SECRET
      }
      var up = jawbone(options);

      process.nextTick(function(){
        return done(null,profile);
      })
    }
  )

  passport.use(jawbone);

  app.get('/auth/jawbone',passport.authenticate('jawbone'));

  app.get('/auth/jawbone/callback',
    passport.authenticate('jawbone',{ failureRedirect:'/login'}),
    function(req,res){
      console.log('Successful authentication!');
      res.redirect('/');
  });

  app.get('/jawbone/pubsub', function(req,res){
    console.log('webhook received');
  });

  app.get('/jawbone/update', function(req,res){
    up.webhook.create('http://127.0.0.1:9000/jawbone/pubsub',function(err,body){
      console.log(JSON.parse(body).data);
    });
  });

};