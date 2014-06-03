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
    if ($scope.user.attributes.HP === 0) {
      var title = 'Unfit for Battle';
      var body = 'You don\'t look so good. You need to recover some of your health before you can battle again.';

      util.showAlert($ionicPopup, title, body, 'OK', function() {});
    } else {
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
    }
  };
})

.controller('AddFriendsCtrl', function($scope, User, $ionicPopup) {
  // friends is accessed from $rootScope.user.friends in the template
  $scope.friends = [];
  User.query(function(users){
    for (var i=0; i<users.length; i++) {
      if ($scope.user['_id'] !== users[i]['_id']) {
        $scope.friends.push(users[i]);
      }
    }
  });

  $scope.addFriend = function(id) {
    var friendExists = false;
    for (var i=0; i<$scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      if (friend === id) {
        friendExists = true;
      }
    }
    if (!friendExists) {
      $scope.user.friends.push(id);
      title = 'Friend Added';
      body = 'Your friend has been added.';
    } else {
      title = 'Alread Friends'
      body = 'You are already friends.'
    }
    util.showAlert($ionicPopup,title,body,'OK',function(){});
  }
})