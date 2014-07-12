angular.module('mobile.inventory.controllers')

.controller('InventoryCtrl', function($scope, Shop, $ionicLoading) {
  // inventory is accessed from $rootScope.user.inventory in the template
  var inventory = $scope.user.inventory;

  var makeCopy = function(object) {
    objectCopy = {};
    for (var key in object) {
      objectCopy[key] = object[key];
    }
    return objectCopy;
  };

  $scope.inventory = [];
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  Shop.query( function (storeItems) {
    for (var i=0; i<inventory.length; i++) {
      var itemId = inventory[i].storeId;
      for (var j=0; j<storeItems.length; j++) {
        var storeItem = makeCopy(storeItems[j]);
        if (storeItem['_id'] === itemId){
          storeItem['inventoryId'] = inventory[i].id;
          if (inventory[i].equipped) {
            storeItem['equipped'] = 'Equipped';
          }
          $scope.inventory.push(storeItem);
        }
      }
    }
    clearTimeout(loading);
    $ionicLoading.hide();
    checkItems();
  });

  $scope.equipmentTab = 'button-tab-active';
  $scope.equipment = function() {
    $scope.isEquipment = true;
    $scope.equipmentTab = 'button-tab-active';
    $scope.itemsTab = '';
  };

  $scope.potion = function() {
    $scope.isEquipment = false;
    $scope.equipmentTab = '';
    $scope.itemsTab = 'button-tab-active';
  };

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

  $scope.hasItem = {
    weapon: false,
    armor: false,
    accessory: false,
    potion: false
  };

  var checkItems = function() {
    var quantity = {}
    for (var i=0; i<$scope.inventory.length; i++) {
      var item = $scope.inventory[i].type;
      quantity[item] = quantity[item] || 0;
      quantity[item]++;
    }

    for (var key in $scope.hasItem) {
      if (quantity[key]) {
        $scope.hasItem[key] = true;
      }
    }
  };

});
