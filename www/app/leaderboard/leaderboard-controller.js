angular.module('mobile.leaderboard.controllers')

.controller('LeaderboardCtrl', function($scope, $ionicLoading, User, Leaderboard) {
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.allTab = 'button-tab-active';
  $scope.all = function() {
    $scope.allTab = 'button-tab-active';
    $scope.friendsTab = '';
    $scope.leaderboard = [];
    Leaderboard.query(function(users) {
      $scope.leaderboard = users;
      clearTimeout(loading);
      $ionicLoading.hide();
    })
  };

  $scope.friends = function() {
    $scope.allTab = '';
    $scope.friendsTab = 'button-tab-active';
    $scope.leaderboard = [];
    $scope.leaderboard.push($scope.user);
    for(var i = 0; i < $scope.user.friends.length; i++){
      User.get({id : $scope.user.friends[i]}, function(user) {
        if (user['_id']) {
          $scope.leaderboard.push(user);
        }
      })
    }
  };

  $scope.all();
});
