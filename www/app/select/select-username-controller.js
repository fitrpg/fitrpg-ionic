angular.module('mobile.select.controllers')

.controller('UsernameCtrl',function($rootScope, $scope, $state, User, localStorageService, $cacheFactory, CheckUsername) {

  var localUserId = localStorageService.get('userId');

  $scope.submit = function(username) {

    // attempt to clear cache - may not work necessarily
    // var $httpDefaultCache = $cacheFactory.get('$http');
    // $httpDefaultCache.removeAll();
    // end attempt

    User.get({id : localUserId}, function (user) {
      $rootScope.user = user;
      CheckUsername.get({username:username}, function (user) { //this will return an object or null
        if (user.username === username) {
          $window.alert('Sorry! That username already exists.')
         } else {
          $rootScope.user.username = username;
          localStorageService.set('username', username);
        }
      });
    });

    $state.transitionTo('select'); // in the future don't let them transition in case their is a duplicate UN
  }

  if(localStorageService.get('username')){
    $state.transitionTo('app.character');
  }

});
