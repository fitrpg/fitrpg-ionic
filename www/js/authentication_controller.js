angular.module('app.auth', ['LocalStorageModule'])

// Handles scope over the entire app to check if we are authenticated throughout
// every single page. Never shows a page unless the fitbit-token/jawbone-token is stored locally
.controller('AuthenticationController', function ($scope, $state, $window, localStorageService) {

  // Check our local storage for the proper credentials to ensure we are logged in, this means users can't get past app unless they select a username
  if (localStorageService.get('username')) {
    if (localStorageService.get('fitbit-token') || localStorageService.get('jawbone-token')) {
      $state.transitionTo('app.character');
      $scope.Authenticated = true;
    }
  } else if (localStorageService.get('fitbit-token') || localStorageService.get('jawbone-token')) {
    $state.transitionTo('app.character');
    $scope.needsUsername = true;
  } else {
    $scope.needsAuthentication = true;
  }

  $scope.logout = function () {
    localStorageService.clearAll();
    //location.reload();
    location.href=location.pathname;

  };

})

.controller('LoginController', function ($scope, $state, FitbitLoginService, JawboneLoginService) {

  $scope.fitbitlogin = FitbitLoginService.login;
  $scope.jawbonelogin = JawboneLoginService.login;

})

.controller('UsernameController', function ($window, $scope, $state, localStorageService) {

  $scope.characterClasses = [{'name': 'RoadDestroyer','value': 'runner'},
                             {'name': 'WeightCrusher', 'value': 'weightlifter'},
                             {'name': 'Jack of All Skills', 'value': 'mixed'},
                             {'name': 'Lay-z Sleeper', 'value': 'lazy'}];

  $scope.selectedChar = $scope.characterClasses[0].name;
  $scope.submitInfo = function(username, selectedChar) {
    //event.preventDefault();
    localStorageService.set('username', username);
    //location.reload(); slow, try the below and see if that work
    location.href=location.pathname;
    // submit a post request, grabbing the local cache stuff
    // and update the username
    // do a check to see if the username is existent already
  }


})


.factory('JawboneLoginService', function ($window, $state, localStorageService) {
  var url = 'https://fitrpg.azurewebsites.net/jawbone/auth';
  var loginWindow, token, hasToken, userId, hasUserId;

  return {
    login: function () {
      loginWindow = $window.open(url, '_blank', 'location=no,toolbar=no');
      loginWindow.addEventListener('loadstart', function (event) {
        hasToken = event.url.indexOf('?token=');
        hasUserId = event.url.indexOf('&userid=');
        if (hasToken > -1) {
          token = event.url.substring(hasToken + 7);
          userId = event.url.substring(hasUserId + 8)
          localStorageService.set('jawbone-token', token);
          localStorageService.set('userId', userId);
          location.href=location.pathname;
          //location.reload();
          loginWindow.close();
        }
      });
    },
  };
})

.factory('FitbitLoginService', function ($window, $state, localStorageService, $location) {
  var url = 'http://fitrpg.azurewebsites.net/fitbit/auth';
  var usernameUrl = 'http://fitrpg.azurewebsites.net/fitbit/getUsername';
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
          loginWindow.close();
          location.href=location.pathname;
          //location.reload();
          //eventually set  unique app ID
        }
      });
    },
  };
});
