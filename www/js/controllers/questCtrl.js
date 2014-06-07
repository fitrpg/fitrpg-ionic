angular.module('starter.controllers')

// This controller handles the list of the quests that show up as
// all,active,and completed
.controller('QuestCtrl', function($scope, $ionicLoading, SoloMissions, Quests, User, TimesData, DatesData) {

  // Creates the loading screen that only shows up after 500 ms if items have not yet loaded
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  // Function to add alerts to the user about quests that have recently ended
  $scope.addAlert = function(quest) {
    if (quest.status === 'success') {
      type = 'success';
      msg = 'You completed your quest to ' + quest.shortDesc.toLowerCase() + 'and won ' + quest.gold + " pieces!";
    } else if (quest.status === 'fail') {
      type = 'danger';
      msg = 'Sorry, you didn\'t finish your quest to ' + quest.shortDesc.toLowerCase() + ' Try again in a few days.'
    }
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

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

  // Show all of the quests whose completions dates are after today
  $scope.active = function() {
    $scope.isAll = false;
    $scope.isActive =  true;
    $scope.isComplete = false;
    $scope.allTab = '';
    $scope.activeTab = 'button-tab-active';
    $scope.completedTab = '';


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

    var today = new Date();

    // Iterate over all the quests that the user has stored; maybe eventually just save them
    // locally to the user object
    for (var i =0; i< $scope.user.quests.length; i++) {
      var quest = $scope.user.quests[i];
      var completeDate = new Date(quest.completionTime); //convert date to matched format
      // Iterate over all the quests and get the ones that have status of completed
      if(quest.status === 'success' || quest.status === 'fail') {
        // if 7 days have passed since this was completed, they can do it again so we remove it from their user array
        if(completeDate.addDays(7) <= today) {
          $scope.user.quests = $scope.user.quests.splice($scope.user.quests.indexOf(quest));
        } else { //if 7 days haven't passed, show them in recently completed
          Quests.get({id : quest.questId}, function(q) {
            q.completionTime = quest.completionTime; //add completion time so we can sort them
            if (quest.status === 'success') {
              $scope.successfulQuests.push(q);
            } else {
              $scope.failedQuests.push(q);
            }
          });
        }
      }
    }
  };

  // The following function iterates over the current user's quests and checks to see if
  // any have expired and if so, did they pass/fail the quest
  $scope.checkQuests = function() {
    $scope.alerts = [];
    var today = parseInt(Date.parse(new Date()));
    // Iterate over all the quests that the user has stored
    for (var j =0; j< $scope.user.quests.length; j++) {
      (function(i) { //immediately invoked function to retain the value of the iterable j
        var quest = $scope.user.quests[i];
        if (quest.status === 'active') {
          var completeDate = parseInt(Date.parse(quest.completionTime)); //convert date to matched format
          // check short quests - will have to do better checking of sleep quests later
          if (today >= completeDate) {
            if (quest.numDays < 1) {
              TimesData.get(quest.getObj, function(result) {
                var total = result.total;
                if (total >= quest.winGoal) {
                  $scope.user.quests[i].status = 'success';
                  $scope.user.attributes.gold += quest.gold; // add the winnings
                  User.update($scope.user);
                } else {
                  $scope.user.quests[i].status = 'fail';
                  $scope.user.attributes.gold = $scope.user.attributes.gold - Math.floor(quest.gold/2);
                  User.update($scope.user);
                }
                $scope.addAlert(quest);
              });
            } else if (quest.numDays > 0 ) { //multiday quests
              DatesData.get(quest.getObj, function(result) {
                var total = result.total;
                if (total >= quest.winGoal) {
                  $scope.user.quests[i].status = 'success';
                  $scope.user.attributes.gold += quest.gold; // add the winnings
                  User.update($scope.user);
                } else {
                  $scope.user.quests[i].status = 'fail';
                  $scope.user.attributes.gold = $scope.user.attributes.gold - Math.floor(quest.gold/2);
                  User.update($scope.user);
                }
                $scope.addAlert(quest);
              });
            }
          }
        }
      }(j));
    }
  };

  $scope.all();
  $scope.checkQuests();

  // useful to add days and hours to the start time/day
  Date.prototype.addDays = function(days,hours) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    if(hours) {
      dat.setHours(this.getHours()+hours);
    }
    return dat;
  };

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
.controller('QuestDetailCtrl', function($scope, $stateParams, Quests, $ionicPopup, User, TimesData, DatesData) {
  var questId = $stateParams.questId
  $scope.quest = Quests.get({id: questId});
  $scope.available = true; 
  $scope.active = false;
  $scope.completed = false;
  $scope.userQuest;
  $scope.difficulty = function(num) {
    if ( num <= $scope.quest.difficulty ) {
      return true;
    } else {
      return false;
    }
  };

  // check if any of current user's quests match this one
  var checkQuest = function() {
    for (var i = 0; i < $scope.user.quests.length; i++) {
      var userQuest = $scope.user.quests[i];
      $scope.winGoal = userQuest.winGoal;
      if (userQuest.questId === questId) { 
        $scope.available = false;
        evalQuest(userQuest);
        return; //stop looping
      }
    }
  };

  // called in checkQuest, and when we refresh to show updated data
  var evalQuest = function(userQuest,cb) {
    $scope.userQuest = userQuest; //make userquest obj available to scope
    // FOR ACTIVE QUESTS
    if (userQuest.status === 'active') {
      $scope.active = true;
      if (userQuest.numDays < 1) {
        TimesData.get(userQuest.getObj, function(result) {
          $scope.progress = result.total || 0; //current progress 
          console.log($scope.progress);
          if (cb) { cb() };    
        });
      } else if (userQuest.numDays > 0 ) { // multiday quests
        DatesData.get(userQuest.getObj, function(result) {
          $scope.progress = result.total || 0; // current progress
          console.log($scope.progress);
          if (cb) { cb() };
        });
      }
    // FOR COMPLETED QUESTS
    } else {
      $scope.completed = true;
      if (cb) { cb() };
    }
  };

  checkQuest();


  // function that helps us format the times for dates to make calls to fitbit, so '5' is '05'
  var timify = function(time) {
    if (time.length === 1) {
      time = '0' + time;
    }
    return time;
  }

  // to prettify the display of dates to the user
  var daysWeek = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wedneday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }

  $scope.startQuest = function() {

    var numDays   = $scope.quest.numDays;
    var numHours = $scope.quest.numHours;
    var winGoal = $scope.quest.winGoals;
    var gold = $scope.quest.gold;
    var desc = $scope.quest.shortDescription;
    var start     = new Date(); // start date
    var end = start.addDays(numDays,numHours); // end date
    var startTime = timify(start.getHours()) + ':' + timify(start.getMinutes());
    var title = 'Embark On A New Quest!';

    // for multi-day quests, there's a type, MAY LATER ON HAVE TO ACCOUNT FOR DIFFERENT SLEEP QUESTS
    if (numDays >=1) {
      var body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.shortDescription +
           '</b><br>You will have from today until ' + daysWeek[end.getDay()] + ' at 11:59PM' +
           ' to complete this quest. Do you accept?';
    } else {  // for one-day quests, we want to keep the times, otherwise we don't care
      var body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.shortDescription +
           '</b><br>You will have until ' + end.toLocaleTimeString() +
           ' to complete this quest. Do you accept?';
    }

    var startTheQuest = function() {

      // Generate the query object to be used when calling $resource
      var resourceAttr = {
        id        : $scope.user._id,
        activity  : $scope.quest.activity,
        startDate : start.yyyymmdd(),
        endDate   : end.yyyymmdd(),
      };

      // Generate the quest object to be saved to the user's quests array
      var questObj = {
        questId: questId,
        numDays   : numDays,
        numHours : numHours,
        completionTime: end,
        getObj: resourceAttr,
        status: 'active',
        winGoal: winGoal,
        gold      : gold,
        shortDesc : desc
      };

      if (numDays >= 1 ) {
        resourceAttr.type = $scope.quest.type;
      } else {
        resourceAttr.startTime = timify(start.getHours()) + ':' +timify(start.getMinutes());
        resourceAttr.endTime   = timify(end.getHours())   + ':' +timify(end.getMinutes());
      }

      
      $scope.available = false; 
      $scope.active = true;
      $scope.user.quests.push(questObj);
      User.update($scope.user);
    };

    util.showPrompt($ionicPopup, title, body, 'I accept', 'Too scared', startTheQuest);

  };

  $scope.refresh = function() {
    console.log($scope.user._id);
    evalQuest($scope.quest, function() {
      $scope.$broadcast('scroll.refreshComplete');
    }); 
  };
   
  // necessary to format to the way fitbit wants our dates  
  Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]);
  };

  // useful to add days and hours to the start time/day
  Date.prototype.addDays = function(days,hours) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    if(hours) {
      dat.setHours(this.getHours()+hours);
    }
    return dat;
  };
})