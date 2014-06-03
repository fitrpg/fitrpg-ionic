angular.module('starter.controllers')

.controller('SoloMissionCtrl', function($scope, SoloMissions, User) {

  $scope.new = function() {
    $scope.soloMissions = [];
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
    })
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.soloMissions = [];
  };

  $scope.new();
})

.controller('SoloMissionDetailCtrl', function($scope, $stateParams, SoloMissions, $ionicPopup, User) {
  $scope.soloMission = SoloMissions.get({id: $stateParams.missionId});

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