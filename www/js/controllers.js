angular.module('starter.controllers', ['LocalStorageModule'])

.controller('DashCtrl', function($scope, User) {
  $scope.user = User;
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('InventoryCtrl', function($scope, Inventory) {
  $scope.inventory = Inventory.all();
})

.controller('InventoryDetailCtrl', function($scope, $stateParams, Inventory) {
  $scope.inventoryItem = Inventory.get($stateParams.inventoryId);
})

.controller('ShopCtrl', function($scope, Shop) {
  $scope.shop = Shop.all();
})

.controller('ShopDetailCtrl', function($scope, $stateParams, Shop) {
  $scope.shopItem = Shop.get($stateParams.shopId);
})

.controller('BattleCtrl', function($scope, Battle) {
  $scope.battles = Battle.all();
})

.controller('BattleDetailCtrl', function($scope, $stateParams, Battle) {
  $scope.battle = Battle.get($stateParams.battleId);
})

.controller('SoloMissionCtrl', function($scope, SoloMissions) {
  $scope.soloMissions = SoloMissions.all();
})

.controller('SoloMissionDetailCtrl', function($scope, $stateParams, SoloMissions) {
  $scope.soloMission = SoloMissions.get($stateParams.missionId);
})

.controller('VersusMissionCtrl', function($scope, VersusMissions) {
  $scope.versusMissions = VersusMissions.all();
})

.controller('VersusMissionDetailCtrl', function($scope, $stateParams, VersusMissions) {
  $scope.versusMission = VersusMissions.get($stateParams.missionId);
})

.controller('LeaderboardCtrl', function($scope, Leaderboard) {
  $scope.leaderboard = Leaderboard.all();
})

.controller('LeaderboardDetailCtrl', function($scope, $stateParams, Leaderboard) {
  $scope.leader = Leaderboard.get($stateParams.leaderId);
})

.controller('HelpCtrl', function($scope, $stateParams, Leaderboard) {
})

// .controller('LogoutCtrl', function($scope, $state, localStorageService, $window) {
//   $scope.logout = function () {
//     console.log('logging out');
//     localStorageService.clearAll();
//     $window.location.reload();
//   };
// })

.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function() {
    console.log('Login Succesful');
    $state.go('create');
  };
})

.controller('CreateCtrl', function($scope, $state) {
  $scope.dash = function() {
    console.log('Character Created Successfully');
    $state.go('tab.dash');
  };
})

.controller('AccountCtrl', function($scope) {
});