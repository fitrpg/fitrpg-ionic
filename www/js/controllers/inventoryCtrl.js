angular.module('starter.controllers')

.controller('InventoryCtrl', function($scope, Shop) {
  // inventory is accessed from $rootScope.user.inventory in the template
  var inventory = $scope.user.inventory;
  $scope.inventory = [];

  Shop.query( function (storeItems) {
    for (var i=0; i<inventory.length; i++) {
      var itemId = inventory[i].storeId;
      for (var j=0; j<storeItems.length; j++) {
        var storeItem = storeItems[j];
        if (storeItem['_id'] === itemId){
          storeItem['inventoryId'] = inventory[i].id;
          $scope.inventory.push(storeItem);
        }
      }
    }
  });

  $scope.equipment = function() {
    $scope.isEquipment = true;
  };

  $scope.potion = function() {
    $scope.isEquipment = false;
  };

  $scope.equipment();

})

.controller('InventoryDetailCtrl', function($scope, $state, $stateParams, Shop, User, $ionicPopup, $q) {
  var item;
  var index;
  var inventory = $scope.user.inventory;

  for (var i=0; i<inventory.length; i++) {
    if (inventory[i].id.toString() === $stateParams.inventoryId.toString()) {
      index = i;
      item = inventory[index];
    }
  }

  $scope.inventoryItem = Shop.get({id : item.storeId}, function(){
    $scope.inventoryItem.type = util.capitalize($scope.inventoryItem.type);
  });

  $scope.addClass = function(attr) {
    if (attr > 0) {
      return 'text-green';
    } else {

      return 'text-red';
    }
  };

  $scope.sellItem = function() {
    if (item.equipped === false) {
      $scope.user.attributes.gold = $scope.user.attributes.gold + $scope.inventoryItem.sellPrice;
      if ($scope.inventoryItem.type.toLowerCase() !== 'potion') {
        // remove from inventory
        $scope.user.inventory.splice(index, 1);
      } else {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else if (item.quantity === 1) {
          $scope.user.inventory.splice(index, 1);
        }
      }
      // save user
      User.update($scope.user);
      util.showAlert($ionicPopup, 'Item Sold','You received ' + $scope.inventoryItem.sellPrice + ' gold for your item.', 'OK', function(){
        $state.go('app.character');
      });
    } else {
      util.showAlert($ionicPopup, 'Item Equipped','You must unequip your item before you can sell it.', 'OK', function(){});
    }
  };

  $scope.equipItem = function() {
    if (item.equipped === false) {
      if ($scope.inventoryItem.type.toLowerCase() === 'weapon') {
        if ($scope.inventoryItem.size === 1) {
          if ($scope.user.equipped.weapon1 === '') {
            $scope.user.equipped.weapon1 = $scope.inventoryItem.name;
            item.equipped = true;
          } else if ($scope.user.equipped.weapon2 === '') {
            $scope.user.equipped.weapon2 = $scope.inventoryItem.name;
            item.equipped = true;
          }
        } else if ($scope.inventoryItem.size === 2) {
          if ($scope.user.equipped.weapon1 === '' && $scope.user.equipped.weapon2 === '') {
            $scope.user.equipped.weapon1 = $scope.inventoryItem.name;
            $scope.user.equipped.weapon2 = $scope.inventoryItem.name;
            item.equipped = true;
          }
        }
      } else if ($scope.inventoryItem.type.toLowerCase() === 'armor') {
        if ($scope.user.equipped.armor === '') {
          $scope.user.equipped.armor = $scope.inventoryItem.name;
          item.equipped = true;
        }
      } else if ($scope.inventoryItem.type.toLowerCase() === 'accessory') {
        if ($scope.user.equipped.accessory1 === '') {
          $scope.user.equipped.accessory1 = $scope.inventoryItem.name;
          item.equipped = true;
        } else if ($scope.user.equipped.accessory2 === '') {
          $scope.user.equipped.accessory2 = $scope.inventoryItem.name;
          item.equipped = true;
        }
      }
      User.update($scope.user);
      util.showAlert($ionicPopup, 'Item Equipped','You are ready to wage war against the forces of evil.', 'OK', function() {
        $state.go('app.character');
      })
    } else {
      util.showAlert($ionicPopup, 'Item Already Equipped','You are already using this item. Select a different item to equip.', 'OK', function() {
        $state.go('app.character');
      })
    }
  };

  $scope.useItem = function() {
    if (item.quantity > 0) {
      $scope.user.attributes.hp += $scope.inventoryItem.hp;
      // subtract quantity from inventory -> remove if quantity = 0
      item.quantity -= 1;
    }

    if (item.quantity === 0) {
      $scope.user.inventory.splice(index, 1);
    }

    User.update($scope.user);
    util.showAlert($ionicPopup, 'HP Recovered','Your HP is recovering!', 'OK', function() {
      $state.go('app.character');
    })
  };

  $scope.checkType = function() {
    if ($scope.inventoryItem) {
      if ($scope.inventoryItem.type.toLowerCase() === 'potion') {
        return true;
      } else {
        return false;
      }
    }
  };
})