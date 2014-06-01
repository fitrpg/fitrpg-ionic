// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','app.auth' ,'starter.services', 'starter.directives', 'ui.bootstrap'])

.run(function($rootScope,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
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

    .state('app.solomission', {
      url: '/solomission',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-solomission.html',
          controller: 'SoloMissionCtrl'
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

    .state('app.vsmission', {
      url: '/vsmission',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-vsmission.html',
          controller: 'VersusMissionCtrl'
        }
      }
    })
    .state('app.vsmission-detail', {
      url: '/vsmission/:missionId',
      views: {
        'menuContent': {
          templateUrl: 'templates/vs-detail.html',
          controller: 'VersusMissionDetailCtrl'
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/character');

})
