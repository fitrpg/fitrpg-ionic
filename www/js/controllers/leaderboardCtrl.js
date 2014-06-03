angular.module('starter.controllers')

.controller('LeaderboardCtrl', function($scope, User) {
  $scope.all = function() {
    $scope.leaderboard = [];
    User.query(function(users) {
      $scope.leaderboard = users;
    })
  };

  $scope.friends = function() {
    $scope.leaderboard = [];
    for(var i = 0; i < $scope.user.friends.length; i++){
      User.get({id : $scope.user.friends[i]}, function(user) {
        if (user['_id']) {
          $scope.leaderboard.push(user);
        }
      })
    }
  };

  $scope.all();
})