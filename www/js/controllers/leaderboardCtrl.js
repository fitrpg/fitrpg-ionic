angular.module('starter.controllers')

.controller('LeaderboardCtrl', function($scope, $ionicLoading, User) {
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.all = function() {
    $scope.leaderboard = [];
    User.query(function(users) {
      $scope.leaderboard = users;
      clearTimeout(loading);
      $ionicLoading.hide();
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