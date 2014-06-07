angular.module('starter.controllers')

.controller('ShopCtrl', function($rootScope, $state, $scope, Shop, $ionicLoading) {
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.getData = function() {
    $scope.shop = [];
    Shop.query( function (items) {
      var userLvl = $scope.user.attributes.level;
      for (var i=0; i<items.length; i++) {
        var item = items[i];
        if (userLvl >= item.level) {
          $scope.shop.push(item);
        }
      }
      clearTimeout(loading);
      $ionicLoading.hide();
    });
  };

  $scope.equipmentTab = 'button-tab-active';
  $scope.equipment = function() {
    $scope.isEquipment = true;
    $scope.equipmentTab = 'button-tab-active';
    $scope.itemsTab = '';
  };

  $scope.potion = function(id) {
    $scope.isEquipment = false;
    $scope.equipmentTab = '';
    $scope.itemsTab = 'button-tab-active';
  };

  $scope.getData();
  $scope.equipment();

  $scope.showList = {
    weapons: true,
    armor: true,
    accessories: true,
    potions: true
  };

  $scope.toggleList = function(list) {
    $scope.showList[list] = !$scope.showList[list];
  };

})

.controller('ShopDetailCtrl', function($scope, $stateParams, Shop, User, $ionicPopup, $q) {
  $scope.shopItem = Shop.get({id : $stateParams.shopId}, function(item){
    $scope.shopItem.type = util.capitalize($scope.shopItem.type);
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
})