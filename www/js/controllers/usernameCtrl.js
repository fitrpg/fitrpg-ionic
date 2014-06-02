angular.module('starter.controllers')

.controller('UsernameCtrl',function($rootScope, $scope, $state, User, localStorageService) {

  var localUserId = localStorageService.get('userId');

  $scope.submit = function(username) {

    User.get({id : localUserId}, function (user) {
      $rootScope.user = user;
      $rootScope.user.username = username;
      localStorageService.set('username', username);
    });

    $state.transitionTo('select');
  }

  if(localStorageService.get('username')){
    $state.transitionTo('app.character');
  }

});
