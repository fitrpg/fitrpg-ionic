angular.module('mobile.quest.controllers')

.constant('daysWeek', {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wedneday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
})

// This particular controller handles the individual pages of each quest
.controller('QuestDetailCtrl', function($scope, $state, $stateParams, Quests, $ionicPopup, User, TimesData, DatesData, daysWeek, finishQuest, NewTimesData, $cordovaSocialSharing) {
  var questId = $stateParams.questId
  $scope.quest = Quests.get({id: questId});
  $scope.availableQuest = true;
  $scope.activeQuest = false;
  $scope.completedQuest = false;
  $scope.userQuest;

  // Show 1-5 stars on the screen depending on the difficulty
  $scope.difficulty = function(num) {
    return num <= $scope.quest.difficulty;
  };

  var sendTweet = function (message) {
    $cordovaSocialSharing.shareViaTwitter(message).then(function(result) {
    // Success!
    }, function(err) {
    // An error occured. Show a message to the user
    });
  };

  // Check if the user currently has this quest active or completed
  var pickOutQuest = function() {
    for (var i = 0; i < $scope.user.quests.length; i++) {
      $scope.winGoal = $scope.user.quests[i].winGoal;
      if ($scope.user.quests[i].questId === questId) {
        $scope.availableQuest = false;
        $scope.userQuest = $scope.user.quests[i];
        evalQuest();
        return; //stop looping
      }
    }
  };

  // Called in pickOutQuest, and when we refresh to show updated data
  // We also return true or false for whether or not the quest has been completed
  var evalQuest = function(cb) {
    if ($scope.userQuest.status === 'active') {
      $scope.activeQuest = true;
      $scope.$broadcast('timer-set-countdown');
      $scope.parsedDate = Date.parse($scope.userQuest.completionTime);
      if ($scope.userQuest.numDays < 1) {
        if ($scope.userQuest.getObj.startDate !== $scope.userQuest.getObj.endDate) {
          var newGetObjectBeforeMidnight = {};
          newGetObjectBeforeMidnight.startTime = $scope.userQuest.getObj.startTime;
          newGetObjectBeforeMidnight.endTime = '23:59';
          newGetObjectBeforeMidnight.startDate = $scope.userQuest.getObj.startDate;
          newGetObjectBeforeMidnight.id = $scope.userQuest.getObj.id;
          newGetObjectBeforeMidnight.activity = $scope.userQuest.getObj.activity;
          NewTimesData.get(newGetObjectBeforeMidnight, function(result) {
            var preMidnightTotal = parseInt(result.total) || 0;
            var newGetObjectAfterMidnight = {};
            newGetObjectAfterMidnight.startTime = '00:00';
            newGetObjectAfterMidnight.endTime = $scope.userQuest.getObj.endTime;
            newGetObjectAfterMidnight.startDate = $scope.userQuest.getObj.endDate;
            newGetObjectAfterMidnight.id = $scope.userQuest.getObj.id;
            newGetObjectAfterMidnight.activity = $scope.userQuest.getObj.activity;
            NewTimesData.get(newGetObjectAfterMidnight, function(result2) {
              var postMidnightTotal = parseInt(result2.total) || 0;
              $scope.progress = preMidnightTotal + postMidnightTotal;
              var completed = $scope.progress >= $scope.winGoal;
              console.log('completed',completed);
              if (cb) { cb(completed) };
            });
          });
        } else {
          TimesData.get($scope.userQuest.getObj, function(result) {
            $scope.progress = result.total || 0; //current progress
            var completed = $scope.progress >= $scope.winGoal;
            if (cb) { cb(completed) };
          });
        }
      } else if ($scope.userQuest.numDays > 0 ) { // multiday quests
        DatesData.get($scope.userQuest.getObj, function(result) {
          $scope.progress = result.total || 0; // current progress
          var completed = $scope.progress >= $scope.winGoal;
          if (cb) { cb(completed) };
        });
      }
    } else if ($scope.userQuest.status === 'success' || $scope.userQuest.status === 'fail') {
      $scope.completedQuest = true;
      if (cb) {cb()};
    }
  };

  // function that helps us format the times for dates to make calls to fitbit, so '5' is '05'
  var timify = function(time) {
    if (time.length === 1) {
      time = '0' + time;
    }
    return time;
  }

  $scope.startQuest = function() {

    var numDays   = $scope.quest.numDays;
    var numHours = $scope.quest.numHours;
    var winGoal = $scope.quest.winGoals;
    var gold = $scope.quest.gold;
    var desc = $scope.quest.shortDescription;
    var start     = new Date(); // start date
    var addD  = numDays-1 >= 0 ? numDays-1 : 0; // the number of days we're adding to get to 'end'
    var startTime = timify(start.getHours()) + ':' + timify(start.getMinutes());
    var title = 'Embark On A New Quest!';
    var endString,end,body;

    // for multi-day quests, there's a type, MAY LATER ON HAVE TO ACCOUNT FOR DIFFERENT SLEEP QUESTS
    if (numDays >=1) {
      end = start.addDays(addD); // end date
      end.setHours(23);
      end.setMinutes(59); // timer always ends at midnight
      endString = daysWeek[end.getDay()] + ' at 11:59PM';
      body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.shortDescription +
           '</b><br>You will have from today until ' + endString +
           ' to complete this quest. Do you accept?';
    } else {  // for one-day quests, we want to keep the times, otherwise we don't care
      end = start.addDays(addD,numHours); // end date
      endString =end.toLocaleTimeString();
      body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.shortDescription +
           '</b><br>You will have until ' + endString +
           ' to complete this quest. Do you accept?';
    }

    var startTheQuest = function() {

      // Generate the quest object to be saved to the user's quests array
      var questObj = {
        questId: questId,
        numDays   : numDays,
        numHours : numHours,
        completionTime: end,
        status: 'active',
        winGoal: winGoal,
        gold      : gold,
        shortDesc : desc,
        endString : endString,
        getObj: { // the query object to be used when calling $resource
                  id        : $scope.user._id,
                  activity  : $scope.quest.activity,
                  startDate : start.yyyymmdd(),
                  endDate   : end.yyyymmdd(),
                }
      };

      if (numDays >= 1 ) {
        questObj.getObj.type = $scope.quest.type;
      } else {
        questObj.getObj.startTime = timify(start.getHours()) + ':' +timify(start.getMinutes());
        questObj.getObj.endTime   = timify(end.getHours())   + ':' +timify(end.getMinutes());
      }

      $scope.availableQuest = false;
      $scope.user.quests.push(questObj);
      User.update($scope.user);
      $state.go('app.quest');

    };

    util.showPrompt($ionicPopup, title, body, 'I accept', 'Too scared', startTheQuest);

  };

  $scope.refresh = function() {
    evalQuest($scope.quest, function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.manualCompleteQuest = function() {
    var title, body, endQuest, message;
    evalQuest(function(completed) {
      console.log('completed',completed);
      if(completed) {
        title    = 'Success!';
        body     = 'Congratulations! You completed this quest. You won ' + $scope.userQuest.gold + ' gold pieces.';
        message  = 'I completed my quest: ' + $scope.userQuest.shortDesc + ' I\'m super fit! @fitrpg';
        endQuest = finishQuest.winQuest;
      } else {
        title    = 'Fail!';
        body     = 'Sorry, you did not complete your quest on time. You lost gold. Try again later.';
        message  = 'I didn\'t complete my quest: ' + $scope.userQuest.shortDesc + ' I need to train more. @fitrpg';
        endQuest = finishQuest.loseQuest;
      }
      User.update(endQuest($scope.user,$scope.userQuest));
      util.showPrompt($ionicPopup, title, body, 'Share', 'Continue',
        function() {
          sendTweet(message);
        },
        function() {
          $state.go('app.quest');
        }
      );
    });
  };

  // Every time we load the page, we check to see if the quest is completed or not
  pickOutQuest();
});