var OAuth = require('oauth').OAuth;
var Q = require('q');

// This takes in the desired path, method, and security tokens and returns that resource from fitbit
var requestResource = function (path, method, user, userId) {
	var url = "https://api.fitbit.com/1/user/" + (userId || "-") + path;
	var deferred = Q.defer();
	this.oauth.getProtectedResource(url, method, user.token, user.tokenSecret, deferred.makeNodeResolver());
	return deferred.promise;
}

// passport-fitbit gives us back tokens we need to access our data
// save them as local variables here
exports.saveTokens = function(aToken, aTokenSecret) {
	accessToken = aToken;
	accessTokenSecret = aTokenSecret;
};

// This creates a new FitbitAPI client using the consumer key and secret
exports.FitbitAPIClient = function(consumerKey, consumerSecret) {
  this.oauth = new OAuth(
    'https://api.fitbit.com/oauth/request_token', //fitbit req token
    'https://api.fitbit.com/oauth/access_token', //fitbit access token
    consumerKey, // developer consumer key
    consumerSecret, //developer consumer secret
    '1.0', //current api version.
    'http://fitbitgamify.azurewebsites.net/auth/fitbit/callback', //change this later (check if i can set it to null)
    'HMAC-SHA1'
  );
};


// This takes in a user id and subscribes that ID to fitbit so that we are notified every time
// that user syncs their device.
// AMIRA TODO: CHECK IF THEY ARE ALREADY SUBSCRIBED AND IF SO, DON'T RE-SUBSCRIBE AS THIS WILL BREAK
// AMIRA TODO: FIGURE OUT A DIFFERENT WAY TO ACCESS THE TOKEN AND THE SECRET
exports.subscribeUser = function(id,cb) {
  requestResource("/apiSubscriptions/"+id+".json", "POST", accessToken, accessTokenSecret)
    .then(function (results) {
	    cb();
    });
}

exports.getAllFitbitData = function(req,res) {
	var date = req.user.createdAt.yyyymmdd();
	requestResource("/profile.json", "GET", req.user)
	    .then(function (results) {
	      var obj = JSON.parse(results[0]).user;
	      req.user.prof = [obj];
	 });

	//get sedentarymins
    requestResource("/activities/date/"+date+".json", "GET", req.user)
    .then(function (results) {
      var activities = JSON.parse(results[0]);
      req.user.sedentaryMins = activities.summary.sedentaryMinutes;
      req.user.veryActiveMins = activities.summary.veryActiveMinutes;
      req.user.fairlyActiveMins = activities.summary.fairlyActiveMinutes;
      req.user.lightlyActiveMins = activities.summary.lightlyActiveMinutes;
      req.user.steps = activities.summary.steps;
      req.user.calories = activities.summary.caloriesOut; //not 100% sure if this is accurate representation of calories
    });

	//get sleep
	requestResource("/sleep/date/"+date+".json", "GET", req.user)
    .then(function (results) {
      req.user.sleep = results[0];
    });

    //get badges -- no date!
	requestResource("/badges.json", "GET", req.user)
    .then(function (results) {
      var badges = JSON.parse(results[0]).badges;
      badgeArray = [];
      for (var i = 0; i<badges.length;i++ ) {
      	badgeArray.push({"badgeType":badges[i].badgeType,
      					 "timesAchieved": badges[i].timesAchieved,
      					 "value": badges[i].value,
      					 "dateTime": badges[i].dateTime
      					});
      }
      req.user.badges = badgeArray;
    });

    //get friends and also create models for each one if they exist, if they don't then store them!
    requestResource("/friends.json", "GET", req.user)
    .then(function (results) {
      var friends = JSON.parse(results[0]).friends;
      var friendsArr = [];
      for (var i = 0; i < friends.length; i++ ) {
      	friendsArr.push(friends[i].user.encodedId);
      }

      req.user.friends = friendsArr;
      User.findOne({originalId: req.user.originalId}, function(err,foundUser) {
      	foundUser.friends = req.user.friends;
      	foundUser.steps = req.user.steps;
      	foundUser.calories = req.user.calories;
      	foundUser.badges = req.user.badges;
      	foundUser.sedentarymins = req.user.sedentarymins;
      	foundUser.veryActiveMins = req.user.veryActiveMins;
      	foundUser.fairlyActiveMins = req.user.fairlyActiveMins;
      	foundUser.lightlyActiveMins = req.user.lightlyActiveMins;
      	foundUser.prof = req.user.prof;
      	foundUser.save(function(err,saved) {
      		res.sendfile(__dirname + '/public/client/templates/index.html');

      	});
      });

    });
}
