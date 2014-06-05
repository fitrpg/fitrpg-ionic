angular.module('starter.controllers')

.controller('QuestCtrl', function($scope, $ionicLoading, SoloMissions, Quests, User, TimesData, DatesData) {

  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.all = function() {
    $scope.isAll = true;
    $scope.isActive = false;
    $scope.isComplete = false;

    $scope.quests = [];
    Quests.query(function(quests){
      $scope.quests = quests;
      clearTimeout(loading);
      $ionicLoading.hide();
    });
  };

  // Show all of the quests whose completions dates are after today
  $scope.active = function() {
    $scope.isAll = false;
    $scope.isActive =  true;
    $scope.isComplete = false;

    var today = new Date();
    $scope.quests = [];
    for (var i =0; i< $scope.user.quests.length; i++) {
      var quest = $scope.user.quests[i];
      var complete = new Date(quest.completionTime);
      if(complete > today) {
        Quests.get({id : quest.questId}, function(q) {
          console.log('whee');
          $scope.quests.push(q);
        });
      } 
    }
  };

  // Show all of the quests that have already been completed (in the last week?)
  $scope.completed = function() {
    $scope.isAll = false;
    $scope.isActive = false;
    $scope.isComplete = true;
    // completed missions in user database
    $scope.soloMissions = [];
    for (var i=0; i<$scope.user.battles.length; i++) {
      var completedBattle = $scope.user.battles[i];
      SoloMissions.get({id: completedBattle['_id']}, function(battle) {
        $scope.soloMissions.push(battle);
      });
    }

    var today = new Date();
    $scope.quests = [];
    for (var i =0; i< $scope.user.quests.length; i++) {
      var quest = $scope.user.quests[i];
      var completeDate = new Date(quest.completionTime);
      if(completeDate > today) { //change this later, completeDate should be< today
        if (quest.numDays < 0) {
          TimesData.get(quest.getObj, function(result) {
            var total = result.total;
            if (total >= quest.winGoal) {
              quest.status = 'success'; 
              User.update($scope.user);
            } else {
              quest.status = 'fail';
              User.update($scope.user);
            }
          });
        } else if (quest.numDays > 0 ) {
          DatesData.get(quest.getObj, function(num) {
            var total = result.total;
            if (total >= quest.winGoal) {
              quest.status = 'success';
              User.update($scope.user);
            } else {
              quest.status = 'fail';
              User.update($scope.user);
            }
          });
        }
      } 
    }
  };

  $scope.all();
})

.controller('QuestDetailCtrl', function($scope, $stateParams, Quests, $ionicPopup, User, TimesData, DatesData) {
  var questId = $stateParams.questId
  $scope.quest = Quests.get({id: questId});
  console.log($scope.quest);
  $scope.difficulty = function(num) {
    if ( num <= $scope.quest.difficulty ) {
      return true;
    } else {
      return false;
    }
  };

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
    var start     = new Date(); // start date
    var end = start.addDays(numDays,numHours); // end date
    var startTime = timify(start.getHours()) + ':' + timify(start.getMinutes());
    var title = 'Embark On A New Quest!';

    // for multi-day quests, there's a type, MAY LATER ON HAVE TO ACCOUNT FOR DIFFERENT SLEEP QUESTS
    if (numDays >=1) {
      var body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.description + 
           '</b><br>You will have from today until ' + daysWeek[end.getDay()] + ' at 11:59PM' + 
           ' to complete this quest. Do you accept?';
    } else {  // for one-day quests, we want to keep the times, otherwise we don't care
      var body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.description + 
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
        winGoal: winGoal
      };

      if (numDays >= 1 ) {
        resourceAttr.type = $scope.quest.type;
      } else {
        resourceAttr.startTime = timify(start.getHours()) + ':' +timify(start.getMinutes());
        resourceAttr.endTime   = timify(end.getHours())   + ':' +timify(end.getMinutes());
      }
      
      $scope.user.quests.push(questObj);
      console.log($scope.user);
      User.update($scope.user);
    };

    util.showPrompt($ionicPopup, title, body, 'I accept', 'Too scared', startTheQuest);

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