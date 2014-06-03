angular.module('starter.controllers')

.controller('SoloMissionCtrl', function($scope, SoloMissions, Quests, User) {

  $scope.new = function() {
    $scope.soloMissions = [];
    $scope.quests = [];
    SoloMissions.query(function(solos){
      var allSoloMissions = solos;
      var soloMission;

      //need to filter missions that are complete or greater than current user level
      for (var i=0; i< allSoloMissions.length; i++) {
        soloMission = allSoloMissions[i];
        if (soloMission.level <= $scope.user.attributes.level) {
          $scope.soloMissions.push(soloMission);
        }
      }
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


.controller('QuestDetailCtrl', function($scope, $stateParams, Quests, $ionicPopup, User, datePicker) {
  var questId = $stateParams.missionId
  $scope.quest = Quests.get({id: questId});
  $scope.difficulty = function(num) {
    if ( num <= $scope.quest.difficulty ) {
      return true;
    } else {
      return false;
    }
  };

  // When user presses the button to stat a quest, they then have to select a time range
  // based off the days 
  // They have the option to start the quest that same day, which means whatever they've done
  // since midnight
//   $scope.startQuest = function() {
//     var title, body;

//     var questObject = {
//       id: questId
//     }
//     $scope.user.quests.push(questObject);
//     User.update($scope.user);



//   }
    
//   Date.prototype.yyyymmdd = function() {
//   var yyyy = this.getFullYear().toString();
//   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
//   var dd  = this.getDate().toString();
//   return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
// };

// Date.prototype.addDays = function(days) {
//    var dat = new Date(this.valueOf())
//    dat.setDate(dat.getDate() + days);
//    return dat;
// }


  //   if ($scope.quest.type === 'boss') {
  //     if ($scope.user.attributes.HP > 0) {
  //       title = 'Mission Started';
  //       body = 'You are waging war against the forces of evil...',

  //       util.showAlert($ionicPopup, title, body, 'Continue', function() {
  //         var winner = util.bossBattle($scope.user,$scope.quest);
  //         title = 'Mission Results';

  //         if (winner.result === 'player') {
  //           $scope.user.attributes.experience += $scope.quest.experience;
  //           $scope.user.attributes.gold += $scope.quest.gold;
  //           body = 'You\'ve crushed evil. Go find more bad guys to defeat!';
  //         } else {
  //           body = 'You were defeated. You may want to train more before doing battle.';
  //         }
  //         $scope.user.attributes.HP = winner.hp;
  //         User.update($scope.user);

  //         util.showAlert($ionicPopup, title, body, 'OK', function(){});

  //       });
  //     } else {
  //       title = 'Rest Up';
  //       body = 'You should get some rest before battle.';
  //       util.showAlert($ionicPopup, title, body, 'OK', function() {});
  //     }
  //   } else {
  //     //if solo mission is quest
  //       // save start time of quest
  //       // if accomplish goals within duration
  //         // display 'You have completed quest!'
  //       // if not
  //         // display 'Your quest has failed.'
  //   }
  // };
})