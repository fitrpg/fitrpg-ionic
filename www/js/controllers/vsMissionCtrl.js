angular.module('starter.controllers')

.controller('VersusMissionCtrl', function($scope, VersusMissions) {

  $scope.new = function() {
    $scope.isComplete = false;
    VersusMissions.query(function(versusMissions) {
        $scope.versusMissions = versusMissions;
    })
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.isComplete = true;
    $scope.versusMissions = [];

    // update user in scope and database
  };

  $scope.new();

})

.controller('VersusMissionDetailCtrl', function($scope, $stateParams, VersusMissions) {
  $scope.versusMission = VersusMissions.get($stateParams.missionId);
  for(var i = 0; i < $scope.user.friends; i++){
    User.get({id : $scope.user.friends[i]}, function(friend) {
      $scope.friends.add(friend);
    })
  }

  $scope.selectFriends = function() {
    $scope.showFriends = true;
  };

  $scope.addFriend = function(id) {
    if ($scope.versusMission.friends.length < $scope.versusMission.size) {
      $scope.versusMission.friends.push(id);
    }
  };

  $scope.removeFriend = function(id) {
    for (var i=0; i<$scope.versusMission.friends.length; i++) {
      var friend = $scope.versusMission.friends[i];
      if (friend === id) {
        $scope.versusMission.friends.splice(i,1);
      }
    }
  };

  $scope.inParty = function(id) {
    for (var i=0; i<$scope.versusMission.friends.length; i++) {
      var friend = $scope.versusMission.friends[i];
      if (friend === id) {
        return true;
      }
    }
    return false;
  };

  $scope.requestMission = function() {
    // push notify friends of mission
  };

  // server side could check if all friends accepted mission
  // if all friend accept mission, push notify all friends that mission is starting

  $scope.checkMissionStatus = function() {
    // check start time and duration
    // if past duration check participants data
    // may need to check time intervals for when someone won?
  };

  $scope.checkMissionStatus();
})