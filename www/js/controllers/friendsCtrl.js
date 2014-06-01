angular.module('starter.controllers')

.controller('FriendsCtrl', function($scope, User, $ionicPopup, $q) {
  // friends is accessed from $rootScope.user
  $scope.friends = [];
  for (var i=0; i<$scope.user.friends.length; i++) {
    var friend = $scope.user.friends[i];
    User.get({id: friend}, function(user){
      $scope.friends.push(user);
    });
  }

  $scope.requestBattle = function(friendId) {
    // update $scope.battle to reflect status of pending with friend
    $scope.user.missionsVersus.push({type:'battle',enemy:friendId,status:'pending'});
    // post to database to update friends battle status
    User.update($scope.user);

    for (var i=0; i<$scope.friends.length; i++) {
      var friend = $scope.friends[i];
      if (friend['_id'] === friendId) {
        friend.missionsVersus.push({type:'battle',enemy:$scope.user['_id'],status:'request'})
        User.update(friend);
      }
    }
    var title = 'Request Sent';
    var body = 'Your battle request has been sent. You can still equip new weapons or train more until the battle request is accepted.';

    util.showAlert($ionicPopup, title, body, 'OK', function() {

    });

  };
})

.controller('AddFriendsCtrl', function($scope) {
  // friends is accessed from $rootScope.user.friends in the template
})