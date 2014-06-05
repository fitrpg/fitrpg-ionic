angular.module('starter.controllers')

.controller('SoloMissionCtrl', function($scope, $ionicLoading, SoloMissions, Quests, User, TimesData, DatesData) {

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
    } 
  };
})

