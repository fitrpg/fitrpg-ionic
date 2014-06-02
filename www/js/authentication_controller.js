angular.module('app.auth', ['LocalStorageModule', 'ionic'])

// Handles scope over the entire app to check if we are authenticated throughout
// every single page. Never shows a page unless the fitbit-token/jawbone-token is stored locally
.controller('AuthenticationController', function ($cacheFactory,$scope, $state, $window, localStorageService) {

  var $httpDefaultCache = $cacheFactory.get('$http');
  console.log($httpDefaultCache);
  $httpDefaultCache.removeAll();
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
    location.href=location.pathname;

  };

})

.controller('LoginController', function ($scope, $state, FitbitLoginService, JawboneLoginService) {

  $scope.fitbitlogin = FitbitLoginService.login;
  $scope.jawbonelogin = JawboneLoginService.login;

})

.controller('UsernameController', function ($cacheFactory, $window, $rootScope, $scope, $state, localStorageService, User, CheckUsername) {

  $scope.characterClasses = [{'name': 'RoadDestroyer','value': 'runner'},
                             {'name': 'WeightCrusher', 'value': 'weightlifter'},
                             {'name': 'Jack of All Skills', 'value': 'mixed'},
                             {'name': 'Lay-z Sleeper', 'value': 'lazy'}];

  $scope.selectedChar = $scope.characterClasses[0].name;

  $scope.submitInfo = function(username, selectedChar) {
    // attempt to clear cache - may not work necessarily
    var $httpDefaultCache = $cacheFactory.get('$http');
    $httpDefaultCache.removeAll();
    // end attempt
    var id = localStorageService.get('userId');
    User.get({id : id}, function (user) { 
      $rootScope.user = user;
      CheckUsername.get({username:username}, function (user) { //this will return an object or null
        if (user.username === username) {
          $window.alert('Sorry! That username already exists.')
         } else {
          localStorageService.set('username', username);
          $rootScope.user.username = username;
          $rootScope.user.character= selectedChar;
          User.update($rootScope.user);
          location.href=location.pathname;
        }
      });
    });

   
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
          //eventually set  unique app ID with jwt?
        }
      });
    },
  };
});
