angular.module('starter.controllers')

.constant('daysWeek', {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wedneday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
})

.factory('finishQuest', function() {
  return {
    winQuest: function(user,userQuest) {
      userQuest.status = 'success';
      user.userQuest = userQuest;
      user.attributes.gold += userQuest.gold;
      return user;
    },
    loseQuest: function(user,userQuest) {
      userQuest.status = 'fail';
      user.userQuest = userQuest;
      user.attributes.gold = user.attributes.gold - Math.floor(quest.gold/2);
      return user;
    }
  }
})

// This controller handles the list of the quests that show up as all,active,and completed
.controller('QuestCtrl', function($scope, $ionicLoading, $ionicScrollDelegate, localStorageService, SoloMissions, Quests, User, TimesData, DatesData) {

  // Creates the loading screen that only shows up after 500 ms if items have not yet loaded
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.allTab = 'button-tab-active';
  $scope.all = function() {
    $scope.isAll = true;
    $scope.isActive = false;
    $scope.isComplete = false;
    $scope.quests = [];
    $scope.availableQuests = [];
    $scope.allTab = 'button-tab-active';
    $scope.activeTab = '';
    $scope.completedTab = '';
    $ionicScrollDelegate.scrollTop();

    // Create an array of ids of quests the user is currently doing
    var currentQuests = [];
    for (var i = 0; i < $scope.user.quests.length; i++ ) {
      currentQuests.push($scope.user.quests[i].questId);
    }
    // Compare all quests against this array and only display them if they're not on it
    Quests.query(function(quests){
      $scope.quests = quests;
      for (var i =0; i<$scope.quests.length;i++) {
        if (currentQuests.indexOf($scope.quests[i]._id) < 0) {
          $scope.availableQuests.push($scope.quests[i]);
        }
      }
      clearTimeout(loading);
      $ionicLoading.hide();
    });
  };

  // Show all of the quests that are active
  $scope.active = function() {
    $scope.isAll = false;
    $scope.isActive =  true;
    $scope.isComplete = false;
    $scope.allTab = '';
    $scope.activeTab = 'button-tab-active';
    $scope.completedTab = '';
    $ionicScrollDelegate.scrollTop();

    var today = new Date();
    $scope.quests = [];
    for (var i =0; i< $scope.user.quests.length; i++) {
      if($scope.user.quests[i].status === 'active') {
        (function(i) {
          Quests.get({id : $scope.user.quests[i].questId}, function(q) {
            $scope.quests.push(q);
          });
        }(i));
      }
    }
  };

  // Show all of the quests that have already been completed in the last week
  $scope.completed = function() {
    $scope.isAll = false;
    $scope.isActive = false;
    $scope.isComplete = true;
    $scope.successfulQuests = [];
    $scope.failedQuests = [];
    $scope.allTab = '';
    $scope.activeTab = '';
    $scope.completedTab = 'button-tab-active';
    $ionicScrollDelegate.scrollTop();
    var today = new Date();
    var refreshQuests = [];

    // Iterate over all the quests that the user has stored; maybe eventually just save them
    // locally to the user object
    for (var j =0; j< $scope.user.quests.length; j++) {
      (function(i) {
        var quest = $scope.user.quests[i];
        var completeDate = new Date(quest.completionTime); //convert date to matched format
        // Iterate over all the quests and get the ones that have status of completed
        if(quest.status === 'success' || quest.status === 'fail') {
          // if 7 days have passed since this was completed, they can do it again so we remove it from their user array
          if(completeDate.addDays(7) > today) {
            refreshQuests.push(quest);
            Quests.get({id : quest.questId}, function(q) {
              q.completionTime = quest.completionTime; //add completion time so we can sort them
              if (quest.status === 'success') {
                $scope.successfulQuests.push(q);
              } else {
                $scope.failedQuests.push(q);
              }
            });
          }
        } else {
          refreshQuests.push(quest);
        }
      }(j));
    }

    $scope.user.quests = refreshQuests;
    User.update($scope.user);
  };

  $scope.all();

  $scope.showList = {
    steps: true,
    distance: true,
    strength: true,
    sleep: true,
    succeed: true,
    fail: true
  }

  $scope.toggleList = function (list) {
    $scope.showList[list] = !$scope.showList[list];
  };

})

// This particular controller handles the individual pages of each quest
.controller('QuestDetailCtrl', function($scope, $state, $stateParams, Quests, $ionicPopup, User, TimesData, DatesData, daysWeek, finishQuest) {
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

  // Check if the user currently has this quest active or completed
  var pickOutQuest = function() {
    for (var i = 0; i < $scope.user.quests.length; i++) {
      $scope.winGoal = $scope.user.quests[i].winGoal;
      if ($scope.user.quests[i].questId === questId) { 
        $scope.availableQuest = false;
        evalQuest($scope.user.quests[i]);
        return; //stop looping
      }
    }
  };

  // Called in pickOutQuest, and when we refresh to show updated data
  // We also return true or false for whether or not the quest has been completed
  var evalQuest = function(userQuest,cb) {
    $scope.userQuest = userQuest;
    if (userQuest.status === 'active') {
      $scope.activeQuest = true;
      $scope.$broadcast('timer-set-countdown');
      $scope.parsedDate = Date.parse($scope.userQuest.completionTime);
      if ($scope.userQuest.numDays < 1) {
        TimesData.get($scope.userQuest.getObj, function(result) {
          $scope.progress = result.total || 0; //current progress 
          if (cb) { cb() };    
          return $scope.progress <= $scope.winGoal; // SWITCH LATER return if the progress is greater than the wingoal
        });
      } else if (userQuest.numDays > 0 ) { // multiday quests
        DatesData.get($scope.userQuest.getObj, function(result) {
          $scope.progress = result.total || 0; // current progress           
          if (cb) { cb() };
          return $scope.progress <= $scope.winGoal;  // SWITCH LATER less than for testing
        });
      }
    } else if (userQuest.status === 'success' || userQuest.status === 'fail') {
      $scope.completedQuest = true;
    }
    if (cb) {cb()};
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
    var title, body, button, endQuest;
    if (evalQuest($scope.quest)) {
      title    = 'Success!';
      body     = 'Congratulations! You completed this quest. You won ' + $scope.userQuest.gold + ' gold pieces.';
      endQuest = finishQuest.winQuest;
    } else {
      title    = 'Fail!';
      body     = 'Sorry, you did not complete your quest on time. You lost gold. Try again later.';
      endQuest = finishQuest.loseQuest;
    }
    util.showAlert($ionicPopup, title, body, button, function() {
      User.update(endQuest($scope.user,$scope.userQuest));
    });
  };

  // Every time we load the page, we check to see if the quest is completed or not
  pickOutQuest();
})