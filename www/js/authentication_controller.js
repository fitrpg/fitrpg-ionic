angular.module('app.auth', ['LocalStorageModule', 'ionic'])

// Handles scope over the entire app to check if we are authenticated throughout
// every single page. Never shows a page unless the fitbit-token/jawbone-token is stored locally
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

})

.controller('LoginController', function ($scope, $state, FitbitLoginService, JawboneLoginService) {

  $scope.fitbitlogin = FitbitLoginService.login;
  $scope.jawbonelogin = JawboneLoginService.login;

})

.factory('JawboneLoginService', function ($window, $state, localStorageService) {
  var url = 'https://fitrpg.azurewebsites.net/jawbone/auth';
  var loginWindow, token, hasToken, userId, hasUserId;

  return {
    login: function () {
      loginWindow = $window.open(url, '_blank', 'location=no,toolbar=no,hidden=yes');
      loginWindow.addEventListener('loadstart', function (event) {
        hasToken = event.url.indexOf('?token=');
        hasUserId = event.url.indexOf('&userid=');
        if (hasToken > -1) {
          token = event.url.substring(hasToken + 7);
          userId = event.url.substring(hasUserId + 8)
          localStorageService.set('jawbone-token', token);
          localStorageService.set('userId', userId);
          location.href=location.pathname;
          loginWindow.close();
        }
      });
    },
  };
})

.factory('FitbitLoginService', function ($window, $state, $ionicLoading, $location, localStorageService, $location) {
  var url = 'http://fitrpg.azurewebsites.net/fitbit/auth';
  var usernameUrl = 'http://fitrpg.azurewebsites.net/fitbit/getUsername';
  var loginWindow, token, hasToken, userId, hasUserId;

  return {
    login: function () {
      loginWindow = $window.open(url, '_blank', 'location=no,toolbar=no,hidden=yes');
      $ionicLoading.show({
         template: '<p>Contacting Fitbit...</p><i class="icon ion-loading-c"></i>',
         animation: 'fade-in',
         showBackdrop: false,
         maxWidth: 200,
         showDelay: 200
      });

      loginWindow.addEventListener("loadstop", function(e) {
          $ionicLoading.hide();
          loginWindow.show();
      });

      loginWindow.addEventListener('loadstart', function (event) {
          hasToken = event.url.indexOf('?oauth_token=');
          hasUserId = event.url.indexOf('&userId=');
        if (hasToken > -1 && hasUserId > -1) {
          token = event.url.match('oauth_token=(.*)&userId')[1];
          userId = event.url.match('&userId=(.*)')[1];
          localStorageService.set('fitbit-token', token);
          localStorageService.set('token-date', JSON.stringify(new Date()));
          localStorageService.set('userId', userId);
          loginWindow.close();
          location.href=location.pathname;
        }
      });
    },
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
}
