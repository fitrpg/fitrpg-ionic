angular.module('app.auth', ['LocalStorageModule'])

// Handles scope over the entire app to check if we are authenticated throughout
// every single page. Never shows a page unless the fitbit-token/jawbone-token is stored locally
.controller('AuthenticationController', function ($scope, $state, $window, localStorageService) {

  // Check our local storage for the proper credentials to ensure we are logged in
  if (localStorageService.get('fitbit-token') || localStorageService.get('jawbone-token')) {
    $scope.isAuthenticated = true;
  } else {
    $scope.isAuthenticated = false;
  }

  $scope.logout = function () {
    console.log('logging out');
    localStorageService.clearAll();
    location.reload();
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
      loginWindow = $window.open(url, '_blank', 'location=no,toolbar=no');
      console.log('opens the window');
      loginWindow.addEventListener('loadstart', function (event) {
        console.log('gets to the event listener');
        hasToken = event.url.indexOf('?token=');
        hasUserId = event.url.indexOf('&userid=');
        if (hasToken > -1) {
          token = event.url.substring(hasToken + 7);
          userId = event.url.substring(hasUserId + 8)
          localStorageService.set('jawbone-token', token);
          localStorageService.set('userId', userId);
          location.reload();
          loginWindow.close();
          // think about implementing json web tokens 
        }
      });
    },
  };
})

.factory('FitbitLoginService', function ($window, $state, localStorageService) {
  var url = 'http://fitrpg.azurewebsites.net/fitbit/auth';
  var loginWindow, token, hasToken, userId, hasUserId;

  return {
    login: function () {
      loginWindow = $window.open(url, '_blank', 'location=no,toolbar=no');
      loginWindow.addEventListener('loadstart', function (event) {
        hasToken = event.url.indexOf('?oauth_token=');
        hasUserId = event.url.indexOf('&userId=')
        if (hasToken > -1 && hasUserId > -1) {
          token = event.url.substring(hasToken + 13);
          userId = event.url.substring(hasUserId + 8);
          localStorageService.set('fitbit-token', token);
          localStorageService.set('userId', userId);
          location.reload();
          loginWindow.close();
          //eventually set the user id here too + unique app ID
        }
      });
    },
  };
});
