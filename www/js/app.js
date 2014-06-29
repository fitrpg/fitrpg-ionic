// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'timer', 'starter.controllers','app.auth','starter.services', 'starter.directives', 'ui.bootstrap', 'ngCordova'])

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

      $cordovaPush.register(config).then(function(result) {
        console.log(result);
      }, function(err) {
        console.log(err);
      });
    }

  });

  $ionicPlatform.registerBackButtonAction(function () {
    if ($state.current.name === 'app.character') {
      navigator.app.exitApp();
    } else if($state.current.name === 'app.feedback' || $state.current.name === 'app.inventory' || $state.current.name === 'app.store' || $state.current.name === 'app.friends' || $state.current.name === 'app.battle' || $state.current.name === 'app.quest' || $state.current.name === 'app.leaderboard' || $state.current.name === 'app.help') {
      $state.go('app.character');
    } else {
      $ionicNavBarDelegate.back();
    }
  }, 100);
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('select', {
      url: '/select',
      templateUrl: 'templates/select-class.html',
      controller: 'SelectClassCtrl'
    })

    .state('username', {
      url: '/username',
      templateUrl: 'templates/username.html',
      controller: 'UsernameCtrl'
    })

    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
    })

    .state('create', {
      url: '/create',
      templateUrl: 'templates/create.html',
      controller: 'CreateCtrl'
    })


    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html"
    })

    .state('app.feedback', {
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'templates/feedback.html',
          controller: 'FeedbackCtrl'
        }
      }
    })

    .state('app.character', {
      url: '/character',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-character.html',
          controller: 'CharacterCtrl'
        }
      }
    })

    .state('app.inventory', {
      url: '/inventory',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-inventory.html',
          controller: 'InventoryCtrl'
        }
      }
    })
    .state('app.inventory-detail', {
      url: '/inventory/:inventoryId',
      views: {
        'menuContent': {
          templateUrl: 'templates/inventory-detail.html',
          controller: 'InventoryDetailCtrl'
        }
      }
    })

    .state('app.store', {
      url: '/store',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-store.html',
          controller: 'ShopCtrl'
        }
      }
    })
    .state('app.store-detail', {
      url: '/store/:shopId',
      views: {
        'menuContent': {
          templateUrl: 'templates/store-detail.html',
          controller: 'ShopDetailCtrl'
        }
      }
    })

    .state('app.friends', {
      url: '/friends',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

    .state('app.addfriends', {
      url: '/friends/add',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-addfriends.html',
          controller: 'AddFriendsCtrl'
        }
      }
    })

    .state('app.battle', {
      url: '/battle',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-battle.html',
          controller: 'BattleCtrl'
        }
      }
    })
    .state('app.quest-detail', {
      url: '/quest/:questId',
      views: {
        'menuContent': {
          templateUrl: 'templates/quest-detail.html',
          controller: 'QuestDetailCtrl'
        }
      }
    })

    .state('app.quest', {
      url: '/quests',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-quest.html',
          controller: 'QuestCtrl'
        }
      }
    })
    .state('app.solomission-detail', {
      url: '/solomission/:missionId',
      views: {
        'menuContent': {
          templateUrl: 'templates/solo-detail.html',
          controller: 'SoloMissionDetailCtrl'
        }
      }
    })
    .state('app.leaderboard', {
      url: '/leaderboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-leaderboard.html',
          controller: 'LeaderboardCtrl'
        }
      }
    })

    .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-help.html',
          controller: 'HelpCtrl'
        }
      }
    })
})

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
