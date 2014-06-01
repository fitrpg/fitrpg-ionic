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
        if (soloMission.level <= user.attributes.level) {
          $scope.soloMissions.push(soloMission);
        }
      }
    })
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.soloMissions = [];
  };


})

.controller('SoloMissionDetailCtrl', function($scope, $stateParams, SoloMissions, $ionicPopup, $timeout, $q) {
  $scope.soloMission = SoloMissions.get($stateParams.missionId);

  $scope.difficulty = function(num) {
    if ( num <= $scope.soloMission.difficulty ) {
      return true;
    } else {
      return false;
    }
  };

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Mission Started',
      template: 'You are waging war against the forces of evil...',
      okText: 'Continue'
    });
    alertPopup.then(function(res) {
      $scope.showResults();
    })
  };

  $scope.showResults = function() {
    //do game logic to see if you win
      // if win give exp and gold
        // display 'You are victorious!'
        // mark mission as complete
      // if lose display on screen
        // diplay 'You are no match for [boss name]'

    var alertPopup = $ionicPopup.alert({
      title: 'Mission Results',
      template: 'You are victorious!',
      okText: 'Close'
    });
    alertPopup.then(function(res) {
    })
  };

  $scope.startMission = function() {
    if ($scope.soloMission.type === 'boss') {
      $scope.showAlert();
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