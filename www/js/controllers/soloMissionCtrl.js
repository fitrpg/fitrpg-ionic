angular.module('starter.controllers')

.controller('SoloMissionCtrl', function($scope, $ionicLoading, SoloMissions, Quests, User) {

  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.new = function() {
    $scope.soloMissions = [];
    $scope.quests = [];
    SoloMissions.query(function(solos){
      var allSoloMissions = solos;
      var soloMission;

      //need to filter missions that are complete or greater than current user level
      for (var i=0; i< allSoloMissions.length; i++) {
        var battleComplete = false;
        soloMission = allSoloMissions[i];
        if (soloMission.level <= $scope.user.attributes.level && ($scope.user.attributes.level-6) < (soloMission.level)) {
          for (var j=0; j<$scope.user.battles.length; j++) {
            var completedBattle = $scope.user.battles[j];
            if (completedBattle['_id'] === soloMission['_id']) {
              battleComplete = true;
            }
          }
          if (!battleComplete) {
            $scope.soloMissions.push(soloMission);
          }
        }
      }
      clearTimeout(loading);
      $ionicLoading.hide();
    });

    Quests.query(function(quests){
      $scope.quests = quests;
      // eventually filter and not show the ones
      // that they've completed in the last week
    });

  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.soloMissions = [];
    for (var i=0; i<$scope.user.battles.length; i++) {
      var completedBattle = $scope.user.battles[i];
      SoloMissions.get({id: completedBattle['_id']}, function(battle) {
        $scope.soloMissions.push(battle);
      });
    }

  };

  $scope.new();
})

.controller('SoloMissionDetailCtrl', function($scope, $stateParams, SoloMissions, $ionicPopup, User) {
  $scope.soloMission = SoloMissions.get({id: $stateParams.missionId});
  // $scope.quest = Quests.get($stateParams.QuestsId)
  $scope.difficulty = function(num) {
    if ( num <= $scope.soloMission.difficulty ) {
      return true;
    } else {
      return false;
    }
  };

  $scope.startMission = function() {
    var title, body;
    if ($scope.soloMission.type === 'boss') {
      if ($scope.user.attributes.HP > 0) {
        title = 'Mission Started';
        body = 'You are waging war against the forces of evil...',

        util.showAlert($ionicPopup, title, body, 'Continue', function() {
          var winner = util.bossBattle($scope.user,$scope.soloMission);
          title = 'Mission Results';

          if (winner.result === 'player') {
            $scope.user.attributes.experience += $scope.soloMission.experience;
            $scope.user.attributes.gold += $scope.soloMission.gold;
            $scope.user.battles.push($scope.soloMission['_id']);
            body = 'You\'ve crushed evil. Go find more bad guys to defeat!';
          } else {
            body = 'You were defeated. You may want to train more before doing battle.';
          }
          $scope.user.attributes.HP = winner.hp;
          User.update($scope.user);

          util.showAlert($ionicPopup, title, body, 'OK', function(){});

        });
      } else {
        title = 'Rest Up';
        body = 'You should get some rest before battle.';
        util.showAlert($ionicPopup, title, body, 'OK', function() {});
      }
    } else {
      //if solo mission is quest
        // save start time of quest
        // if accomplish goals within duration
          // display 'You have completed quest!'
        // if not
          // display 'Your quest has failed.'
    }
  };
})


.controller('QuestDetailCtrl', function($scope, $stateParams, Quests, $ionicPopup, User, TimesData, DatesData) {
  var questId = $stateParams.missionId
  $scope.quest = Quests.get({id: questId});
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

    //hard coded data for testing purposes//

    $scope.user = {"__v":1,"_id":"27NN9K","accessToken":"f54192a962b1c460ef7d7df7344616e2","accessTokenSecret":"9ca27392e2adc5239d8eecfa93da5862","character":"Road Destroyer","createdAt":"2014-05-03T21:03:29.901Z","lastActive":"2014-06-03T21:03:30.104Z","provider":"fitbit","username":"aellawind","profile":{"avatar":"https://d6y8zfzc2qfsl.cloudfront.net/7EC01EB2-6F26-6CE7-6CFE-461A789FD360_profile_100_square.jpg","displayName":"Amira"},"quests":[],"battles":[],"missionsVersus":[{"status":"request","enemy":"2QM6M9","type":"battle"}],"inventory":[],"friends":["22MLZS","25DNJH","25GR44","27Q58N","289NDX","292HVY","2B5J9K","2BJHNK","2BYVDD","2Q2TVT","2Q5X8W","2Q6F86","2QM6M9"],"jawbone":{"workOutLog":[]},"fitbit":{"experience":135897,"HPRecov":0,"strength":0,"dexterity":0,"attackBonus":1,"vitality":2,"endurance":11},"attributes":{"HP":200,"skillPts":0,"level":10,"dexterity":20,"endurance":20,"strength":20,"vitality":20,"experience":0,"gold":5000},"needsUpdate":false};
    var numDays   = $scope.quest.numDays;
    var numHours = $scope.quest.numHours;
    var start     = new Date(); // start date
    var end = start.addDays(numDays,numHours); // end date
    var startTime = timify(start.getHours()) + ':' + timify(start.getMinutes());

    var title = 'Embark On A New Quest!';
    var body = 'This is the mission you\'ve chosen:<br><b>' + $scope.quest.description + 
             '</b><br>You will have until ' + daysWeek[end.getDay()] + ' at ' + end.toLocaleTimeString() + 
             ' to complete this quest. Do you accept?';
    
    var startQuest = function() {
      var resourceAttr = { 
        id        : $scope.user.id,
        activity  : $scope.quest.activity,
        startDate : start.yyyymmdd(),
        endDate   : end.yyyymmdd(),
        startTime : timify(start.getHours()) + ':' +timify(start.getMinutes()),
        endTime   : timify(end.getHours())   + ':' +timify(end.getMinutes())
      };

      // for multi-day quests, there's a type, MAY LATER ON HAVE TO ACCOUNT FOR DIFFERENT SLEEP QUESTS
      if (numDays>1) {
        resourceAttr.type = $scope.quest.type;
      }
      
      var questObj = {
        questId: questId,
        completionTime: end,
        getObj: resourceAttr
      };
      
      $scope.user.quests.push(questObj);
      console.log($scope.user);
      User.update($scope.user);
    };

    util.showPrompt($ionicPopup, title, body, 'I accept', 'Too scared', startQuest);

  };
    
  Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]);
  };

  Date.prototype.addDays = function(days,hours) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    if(hours) {
      dat.setHours(this.getHours()+hours);
    }
    return dat;
  };
})