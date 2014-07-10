angular.module('mobile.authentication.controllers')

.controller('AuthenticationController', function ($scope, $state, $ionicLoading, User, localStorageService) {
  // Check our local storage for the proper credentials to ensure we are logged in, this means users can't get past app unless they select a username
  if (localStorageService.get('username')) {
    if (localStorageService.get('fitbit-token') && isTokenInDate(localStorageService)) {
      $state.transitionTo('app.character');
      $scope.Authenticated = true;
    }
  } else if (localStorageService.get('fitbit-token') && isTokenInDate(localStorageService)) {

    $ionicLoading.show({
       template: '<p>loading...</p><i class="icon ion-loading-c"></i>',
       animation: 'fade-in',
       showBackdrop: false,
       maxWidth: 200,
       showDelay: 100
    });

    User.get({id : localStorageService.get('userId') }, function(user) {
      if (user.username === undefined) {
        $ionicLoading.hide();
        $state.transitionTo('username');
        $scope.Authenticated = true;
      } else {
        $ionicLoading.hide();
        $state.transitionTo('app.character');
        $scope.Authenticated = true;
      }
    });
  } else {
    $scope.needsAuthentication = true;
  }

  $scope.logout = function () {
    localStorageService.clearAll();
    location.href=location.pathname;
  };

});

var isTokenInDate = function(localStorageService){
  var tokenDate = new Date(JSON.parse(localStorageService.get('token-date')));
  if (tokenDate) {
    var today = new Date();
    var timeDiff = Math.abs(today.getTime() - tokenDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays > 10) {
      return false;
    }
  } else {
    return false;
  }
  return true;
};
