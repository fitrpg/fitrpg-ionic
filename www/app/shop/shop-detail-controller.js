angular.module('mobile.shop.controllers')

.controller('ShopDetailCtrl', function($scope, $stateParams, Shop, User, $ionicPopup, $q) {
  $scope.isWeapon = false;
  $scope.shopItem = Shop.get({id : $stateParams.shopId}, function(item){
    $scope.shopItem.type = util.capitalize($scope.shopItem.type);
    if ($scope.shopItem.size === 1) {
      $scope.shopItem.sizeText = 'One-Handed';
    } else if ($scope.shopItem.size === 2) {
      $scope.shopItem.sizeText = 'Two-Handed';
    }
    if ($scope.shopItem.type === 'Weapon') {
      $scope.isWeapon = true;
    }
  });

  $scope.addClass = function(attr) {
    if (attr >= 0) {
      return 'text-green';
    } else {
      return 'text-red';
    }
  };

  $scope.buyItem = function() {
    if ($scope.user.attributes.gold >= $scope.shopItem.cost) {
      $scope.user.attributes.gold = $scope.user.attributes.gold - $scope.shopItem.cost;
      // add to inventory
      var found = false;
      var inventoryId = 0;
      if ($scope.user.inventory.length > 0) {
        inventoryId = $scope.user.inventory[$scope.user.inventory.length-1].id+1;
      }

      if ($scope.shopItem.type.toLowerCase() === 'potion') {
        var inventory = $scope.user.inventory;
        for (var i=0; i<inventory.length; i++) {
          var item = inventory[i];
          if (item.storeId === $scope.shopItem['_id']) {
            found = true;
            item.quantity++;
          }
        }

        if (!found) {
          $scope.user.inventory.push({id: inventoryId, quantity: 1, equipped: false, storeId:$scope.shopItem['_id']});
        }
      } else {
        $scope.user.inventory.push({id: inventoryId, quantity: 1, equipped: false, storeId:$scope.shopItem['_id']});
      }
      User.update($scope.user);
      util.showAlert($ionicPopup, 'Item Purchased', 'Go to your inventory to equip or use your item.', 'OK', function() {
        $state.go('store');
      });
    } else {
      util.showAlert($ionicPopup, 'Insufficient Gold', 'You need more gold. Fight some bosses or go on quests to earn gold.', 'OK', function() {});
    }
  };

  $scope.checkType = function() {
    if ($scope.shopItem.type.toLowerCase() === 'potion') {
      return true;
    } else {
      return false;
    }
  }
});
