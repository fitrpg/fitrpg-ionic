angular.module('mobile', [
  'ionic',
  'timer',
  'ui.bootstrap',
  'ngCordova',
  'mobile.battle',
  'mobile.authentication',
  'mobile.resource',
  'mobile.feedback',
  'mobile.friends',
  'mobile.help',
  'mobile.inventory',
  'mobile.leaderboard',
  'mobile.main',
  'mobile.quest',
  'mobile.select',
  'mobile.shop',
  ])

.run(function($rootScope,$ionicPlatform,$state,$ionicNavBarDelegate,$cordovaPush,$window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    ionic.Platform.fullScreen();

    if(window.cordova) {
      var device = {
        isApple: ionic.Platform.isIOS(),
        isGoogle: ionic.Platform.isAndroid(),
      };

      var androidConfig = {
        'senderID':'replace_with_sender_id',
        'ecb':'onNotification'
      };

      var iosConfig = {
        'badge':'true',
        'sound':'true',
        'alert':'true',
        'ecb':'onNotificationAPN'
      };

      var config;

      if (device.isApple) {
        config = iosConfig;
      } else if (device.isGoogle) {
        config = androidConfig;
      }

      // $cordovaPush.register(config).then(function(result) {
      //   console.log(result);
      // }, function(err) {
      //   console.log(err);
      // });
    }

  });

  $ionicPlatform.registerBackButtonAction(function () {
    if ($state.current.name === 'app.character') {
      navigator.app.exitApp();
    } else if($state.current.name === 'app.feedback' || $state.current.name === 'app.inventory' || $state.current.name === 'app.shop' || $state.current.name === 'app.friends' || $state.current.name === 'app.battle' || $state.current.name === 'app.quest' || $state.current.name === 'app.leaderboard' || $state.current.name === 'app.help') {
      $state.go('app.character');
    } else {
      $ionicNavBarDelegate.back();
    }
  }, 100);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('select', {
      url: '/select',
      templateUrl: 'app/select/select-class.html',
      controller: 'SelectClassCtrl'
    })

    .state('username', {
      url: '/username',
      templateUrl: 'app/select/select-username.html',
      controller: 'UsernameCtrl'
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "app/menu/menu.html"
    })

    .state('app.feedback', {
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'app/feedback/feedback.html',
          controller: 'FeedbackCtrl'
        }
      }
    })

    .state('app.character', {
      url: '/character',
      views: {
        'menuContent': {
          templateUrl: 'app/main/main.html',
          controller: 'CharacterCtrl'
        }
      }
    })

    .state('app.inventory', {
      url: '/inventory',
      views: {
        'menuContent': {
          templateUrl: 'app/inventory/inventory.html',
          controller: 'InventoryCtrl'
        }
      }
    })
    .state('app.inventory-detail', {
      url: '/inventory/:inventoryId',
      views: {
        'menuContent': {
          templateUrl: 'app/inventory/inventory-detail.html',
          controller: 'InventoryDetailCtrl'
        }
      }
    })

    .state('app.shop', {
      url: '/shop',
      views: {
        'menuContent': {
          templateUrl: 'app/shop/shop.html',
          controller: 'ShopCtrl'
        }
      }
    })

    .state('app.shop-detail', {
      url: '/shop/:shopId',
      views: {
        'menuContent': {
          templateUrl: 'app/shop/shop-detail.html',
          controller: 'ShopDetailCtrl'
        }
      }
    })

    .state('app.friends', {
      url: '/friends',
      views: {
        'menuContent': {
          templateUrl: 'app/friends/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

    .state('app.addfriends', {
      url: '/friends/add',
      views: {
        'menuContent': {
          templateUrl: 'app/friends/friends-add.html',
          controller: 'AddFriendsCtrl'
        }
      }
    })

    .state('app.battle', {
      url: '/battle',
      views: {
        'menuContent': {
          templateUrl: 'app/battle/battle.html',
          controller: 'BattleCtrl'
        }
      }
    })

    .state('app.quest', {
      url: '/quests',
      views: {
        'menuContent': {
          templateUrl: 'app/quest/quest.html',
          controller: 'QuestCtrl'
        }
      }
    })

    .state('app.quest-detail', {
      url: '/quest/:questId',
      views: {
        'menuContent': {
          templateUrl: 'app/quest/quest-detail.html',
          controller: 'QuestDetailCtrl'
        }
      }
    })

    .state('app.leaderboard', {
      url: '/leaderboard',
      views: {
        'menuContent': {
          templateUrl: 'app/leaderboard/leaderboard.html',
          controller: 'LeaderboardCtrl'
        }
      }
    })

    .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'app/help/help.html',
          controller: 'HelpCtrl'
        }
      }
    })
})

//PUSH NOTIFICATION FUNCTIONS
function onNotificationAPN (event) {
  if ( event.alert ) {
    navigator.notification.alert(event.alert);
  }

  if ( event.sound ) {
    var snd = new Media(event.sound);
    snd.play();
  }

  if ( event.badge ) {
    $cordovaPush.setBadgeNumber(2).then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }
};

function onNotification(e) {
  console.log(e.event);

  switch( e.event ) {
    case 'registered':
      if ( e.regid.length > 0 )
      {
        // Your GCM push server needs to know the regID before it can push to this device
        // here is where you might want to send it the regID for later use.
        console.log("regID = " + e.regid);
      }
      break;

    case 'message':
      // if this flag is set, this notification happened while we were in the foreground.
      // you might want to play a sound to get the user's attention, throw up a dialog, etc.
      if ( e.foreground )
      {
        var soundfile = e.soundname || e.payload.sound;
        var my_media = new Media("/android_asset/www/"+ soundfile);
        my_media.play();
      }
      else
      {  // otherwise we were launched because the user touched a notification in the notification tray.
        if ( e.coldstart ) {
        }
        else {
        }
      }
      console.log(e.payload.message, e.payload.msgcnt, e.payload.timeStamp)
      break;

    case 'error':
      break;

    default:
      break;
  }
};
