angular.module('mobile.common.services')

.service('CommonService', function(
    $state,
    $ionicPopup,
    $ionicLoading,
    $ionicPlatform,
    localStorageService,
    $window)
  {

  this.device = {
    isApple: ionic.Platform.isIOS(),
    isGoogle: ionic.Platform.isAndroid()
  }

  this.loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  this.navTo = function(location) {
    $state.go('app.' + location);
  };

  this.getSettings = function() {
    var platform;
    if (this.device.isApple) {
      platform = 'ios';
    } else if (this.device.isGoogle) {
      platform = 'android';
    }
    return Settings.get( {platform: platform}, function(item) {
      return item.incentive;
    });
  };

  this.rateApp = function(user, showIncentive) {
    var title = 'Having Fun?';
    var body;
    if (localStorageService.get('rate') || !showIncentive) {
      body = 'Let us know what you think and what features you want added!';
    } else {
      body = 'Leave some feedback for us and get 500 GOLD! Good or bad we want to hear from you so we can continue to add to and improve the game.';
    }
    var likeBtn = '<i class="icon ion-thumbsup"></i>';
    var hateBtn = '<i class="icon ion-thumbsdown"></i>';
    var cancelBtn = '<i class="icon ion-close"></i>';
    util.showPopup($ionicPopup,title,body,hateBtn,likeBtn,cancelBtn,
      function() {
        if (!localStorageService.get('rate')) {
          localStorageService.set('rate',true);
          user.attributes.gold += 500;
        }
        if (this.device.isApple) {
          $window.open('http://itunes.apple.com/app/id887067605', '_system');
        } else if (this.device.isGoogle) {
          $window.open('http://play.google.com/store/apps/details?id=com.fatchickenstudios.fitrpg', '_system');
        }
      },
      function() {
        this.navTo('feedback');
      }
    )
  };

});
