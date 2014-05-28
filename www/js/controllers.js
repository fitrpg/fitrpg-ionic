angular.module('starter.controllers', ['LocalStorageModule'])

.controller('DashCtrl', function($scope, User) {
  $scope.user = User;
  $scope.hasSkillPoints = function() {
    if ($scope.user.attributes.skillPoints) {
      return true;
    } else {
      return false;
    }
  };

  $scope.applyAttributes = function(attr) {
    $scope.user.attributes[attr]++;
    $scope.user.attributes.skillPoints--;
    if (attr === 'vitality') {
      $scope.user.attributes.hp = util.updateHp($scope.user.attributes.hp,'warrior');
      $scope.user.attributes.maxHp = util.updateHp($scope.user.attributes.maxHp,'warrior');
    }
    // update database
  };

  $scope.isEquipped = function(slot) {
    if ($scope.user.attributes[slot] !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  $scope.unequip = function(slot){
    $scope.user.attributes[slot] = undefined;
    // update database
  };

  $scope.equip = function(slot){
    console.log(slot);
    // send to inventory
  };
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AddFriendsCtrl', function($scope, AddFriends) {
  $scope.friends = AddFriends.all();
})

.controller('InventoryCtrl', function($scope, Inventory) {
  $scope.inventory = Inventory.all();
  $scope.filter = 'weapon'
})

.controller('InventoryDetailCtrl', function($scope, $stateParams, Inventory) {
  $scope.inventoryItem = Inventory.get($stateParams.inventoryId);
})

.controller('ShopCtrl', function($scope, Shop) {
  $scope.shop = Shop.query();
  $scope.filter = 'weapon'
})

.controller('ShopDetailCtrl', function($scope, $stateParams, Shop) {
  $scope.shopItem = Shop.get({id : $stateParams.shopId});
})

.controller('BattleCtrl', function($scope, Battle) {
  $scope.battles = Battle.query();
})

.controller('BattleDetailCtrl', function($scope, $stateParams, Battle) {
  $scope.battle = Battle.get({id : $stateParams.battleId});
})

.controller('SoloMissionCtrl', function($scope, SoloMissions) {

  $scope.soloMissions = SoloMissions.query();
})

.controller('SoloMissionDetailCtrl', function($scope, $stateParams, SoloMissions) {
  $scope.soloMission = SoloMissions.get({id : $stateParams.missionId });
})

.controller('VersusMissionCtrl', function($scope, VersusMissions) {
  $scope.versusMissions = VersusMissions.query();
})

.controller('VersusMissionDetailCtrl', function($scope, $stateParams, VersusMissions) {
  $scope.versusMission = VersusMissions.get({id : $stateParams.missionId});
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
