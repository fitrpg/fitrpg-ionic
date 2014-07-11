angular.module('mobile.friends.controllers')

.controller('AddFriendsCtrl', function($scope, User, $ionicPopup,  $ionicLoading, UserSearch) {
  // friends is accessed from $rootScope.user.friends in the template
  $scope.friends = [];

  // User.query(function(users){
  //   for (var i=0; i<users.length; i++) {
  //     if ($scope.user['_id'] !== users[i]['_id']) {
  //       $scope.friends.push(users[i]);
  //     }
  //   }
  //   stopLoading();
  // });

  $scope.addFriendPrompt = function(friend) {
    var title = 'Add Friend';
    var body = 'Do you want to add ' + friend.username + ' to your friends list?';

    util.showPrompt($ionicPopup, title, body, 'Add', 'Cancel', function() {
      $scope.addFriend(friend._id);
    });
  };

  $scope.notFound = false;

  $scope.friendSearch = function(username) {
    $scope.friends = [];

    $scope.notFound = false;

    var loading = setTimeout(function(){
      $ionicLoading.show({
        template: '<p>Searching...</p><i class="icon ion-loading-c"></i>'
      });
    }, 500);

    var stopLoading = function() {
      clearTimeout(loading);
      $ionicLoading.hide();
    };

    UserSearch.query({username: username}, function(users) {
      if (users.length === 0) {
        $scope.notFound = true;
      }

      for (var i=0; i<users.length; i++) {
        if ($scope.user['_id'] !== users[i]['_id']) {
          $scope.friends.push(users[i]);
        }
      }

      stopLoading();
    });
  };

  $scope.addFriend = function(id) {
    var title, body;

    var friendExists = false;
    for (var i=0; i<$scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      if (friend === id) {
        friendExists = true;
      }
    }

    var requestExists = false;
    if ($scope.user.friendRequests) {
      for (var i=0; i<$scope.user.friendRequests.length; i++) {
        var request = $scope.user.friendRequests[i];
        if (request.id === id) {
          requestExists = true;
        }
      }
    }

    if (!friendExists && !requestExists) {
      // $scope.user.friends.push(id);
      $scope.user.friendRequests = $scope.user.friendRequests || [];
      $scope.user.friendRequests.push({status: 'pending', id: id});
      User.update($scope.user);
      User.get({id:id}, function(friend){
        friend.friendRequests = friend.friendRequests || [];
        friend.friendRequests.push({status: 'request', id: $scope.user._id});
        User.update(friend);
      });
      title = 'Friend Request Sent';
      body = 'Your friend request has been sent.';
    } else {
      if (friendExists) {
        title = 'Already Friends'
        body = 'You are already friends.'
      } else if (requestExists) {
        title = 'Request Sent'
        body = 'Your request to be friends has already been sent.'
      }
    }
    util.showAlert($ionicPopup,title,body,'OK',function(){});
  }
});
