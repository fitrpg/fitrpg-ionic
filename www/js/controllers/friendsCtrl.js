angular.module('starter.controllers')

.controller('FriendsCtrl', function($scope, User, $ionicPopup, $q) {
  // friends is accessed from $rootScope.user
  $scope.friends = [];
  for (var i=0; i<$scope.user.friends.length; i++) {
    var friend = $scope.user.friends[i];
    User.get({id: friend}, function(user){
      if (user['_id']) {
        $scope.friends.push(user);
      }
    });
  }

  $scope.requestBattle = function(friendId) {
    var title;
    var body;
    if ($scope.user.attributes.HP === 0) {
      title = 'Unfit for Battle';
      body = 'You don\'t look so good. You need to recover some of your health before you can battle again.';
    } else {
      var battleExists = false;

      for (var i=0; i<$scope.user.missionsVersus.length; i++) {
        var mission = $scope.user.missionsVersus[i];
        if (mission.enemy === friendId) {
          battleExists = true;
        }
      }

      if (!battleExists) {
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
        title = 'Request Sent';
        body = 'Your battle request has been sent. You can still equip new weapons or train more until the battle request is accepted.';
      } else {
        title = 'Battle Pending';
        body = 'You are already have a request to do battle with this friend.';
      }
    }
    util.showAlert($ionicPopup, title, body, 'OK', function() {});
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