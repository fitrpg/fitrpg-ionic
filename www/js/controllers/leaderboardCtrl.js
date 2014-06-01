angular.module('starter.controllers')

.controller('LeaderboardCtrl', function($scope, Leaderboard, Friends) {
  $scope.all = function() {
    User.query(function(users) {
      $scope.leaderboard = users;
    })
  };

  $scope.friends = function() {
    for(var i = 0; i < $scope.user.friends; i++){
      User.get({id : $scope.user.friends[i]}, function(user) {
        $scope.leaderboard.add(user);
      })
    }
  };

  $scope.all();
})