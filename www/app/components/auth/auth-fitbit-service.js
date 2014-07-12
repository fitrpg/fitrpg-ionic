angular.module('mobile.authentication.services')

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
