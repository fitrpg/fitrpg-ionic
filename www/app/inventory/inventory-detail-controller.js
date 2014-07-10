angular.module('mobile.inventory.controllers')

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
  $scope.isWeapon = false;

  $scope.inventoryItem = Shop.get({id : item.storeId}, function(){
    $scope.inventoryItem.type = util.capitalize($scope.inventoryItem.type);
    $scope.inventoryItem.quantity = item.quantity;
    if ($scope.inventoryItem.size === 1) {
      $scope.inventoryItem.sizeText = 'One-Handed';
    } else if ($scope.inventoryItem.size === 2) {
      $scope.inventoryItem.sizeText = 'Two-Handed';
    }
    if ($scope.inventoryItem.type === 'Weapon') {
      $scope.isWeapon = true;
    }
  });

  $scope.addClass = function(attr) {
    if (attr > 0) {
      return 'text-green';
    } else {

      return 'text-red';
    }
  };

  $scope.sellItem = function() {
    var title, body, callback;
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
      title = 'Item Sold';
      body = 'You received ' + $scope.inventoryItem.sellPrice + ' gold for your item.';
      callback = function() {
        $state.go('app.character');
      }
    } else {
      title = 'Item Equipped';
      body = 'You must unequip your item before you can sell it.';
      callback = function(){};
    }

    util.showAlert($ionicPopup, title, body, 'OK', callback);
  };

  var setEquippedItem = function(slot, inventoryItem, name) {
    $scope.user.equipped[slot].name = name;
    $scope.user.equipped[slot].inventoryId = parseFloat(inventoryItem.id);
    return true;
  };

  var addItemAttributes = function() {
    $scope.user.attributes.strength += $scope.inventoryItem.strength;
    $scope.user.attributes.vitality += $scope.inventoryItem.vitality;
    $scope.user.attributes.dexterity += $scope.inventoryItem.dexterity;
    $scope.user.attributes.endurance += $scope.inventoryItem.endurance;
  };

  $scope.equipItem = function() {
    var itemSet = false;
    if (item.equipped === false) {
      if ($scope.inventoryItem.type.toLowerCase() === 'weapon') {
        if ($scope.inventoryItem.size === 1) {
          if ($scope.user.equipped.weapon1.name === '') {
            itemSet = setEquippedItem('weapon1',item,$scope.inventoryItem.name)
          } else if ($scope.user.equipped.weapon2.name === '') {
            itemSet = setEquippedItem('weapon2',item,$scope.inventoryItem.name)
          }
        } else if ($scope.inventoryItem.size === 2) {
          if ($scope.user.equipped.weapon1.name === '' && $scope.user.equipped.weapon2.name === '') {
            itemSet = setEquippedItem('weapon1',item,$scope.inventoryItem.name)
            itemSet = setEquippedItem('weapon2',item,$scope.inventoryItem.name)
          }
        }
      } else if ($scope.inventoryItem.type.toLowerCase() === 'armor') {
        if ($scope.user.equipped.armor.name === '') {
          itemSet = setEquippedItem('armor',item,$scope.inventoryItem.name)
        }
      } else if ($scope.inventoryItem.type.toLowerCase() === 'accessory') {
        if ($scope.user.equipped.accessory1.name === '') {
          itemSet = setEquippedItem('accessory1',item,$scope.inventoryItem.name)
        } else if ($scope.user.equipped.accessory2.name === '') {
          itemSet = setEquippedItem('accessory2',item,$scope.inventoryItem.name)
        }
      }
      if (itemSet) {
        item.equipped = true;
        addItemAttributes();
        User.update($scope.user);
        util.showAlert($ionicPopup, 'Item Equipped','You are ready to wage war against the forces of evil.', 'OK', function() {
          $state.go('app.character');
        })
      } else {
        util.showAlert($ionicPopup, 'Remove An Item','You are holding too many items. You need to take off an item before you can put this on.', 'OK', function() {
          $state.go('app.character');
        })
      }
    } else {
      util.showAlert($ionicPopup, 'Item Already Equipped','You are already using this item. Select a different item to equip.', 'OK', function() {
        $state.go('app.character');
      })
    }
  };

  $scope.useItem = function() {
    var totalVitality = $scope.user.attributes.vitality + $scope.user.fitbit.vitality;
    var maxHp = util.vitalityToHp(totalVitality,$scope.user.characterClass);
    if (item.quantity > 0) {
      $scope.user.attributes.HP += $scope.inventoryItem.hp;
      if ($scope.user.attributes.HP > maxHp) {
        $scope.user.attributes.HP = maxHp;
      }
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
});
