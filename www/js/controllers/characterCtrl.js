angular.module('starter.controllers')

.controller('CharacterCtrl', function($rootScope, $window, $scope, $state, $ionicNavBarDelegate, $ionicLoading, User, Shop, Refresh, localStorageService) {
  // initialize $rootScope.user to eliminate console errors before authentication
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.calculatedData = {};

  $scope.addAlert = function(status) {
    if (status === 'loss') {
      type = 'danger';
      msg = 'You suck. You lost experience and gold.'
    } else if (status === 'win') {
      type = 'success';
      msg = 'You win. You gained experience and gold.'
    } else if (status === 'request') {
      type = '';
      msg = 'Someone wants to battle you.';
    }
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  var calculateData = function(user) {
    $scope.calculatedData.currentXp = Math.floor(util.currentLevelExp(user.attributes.level, user.fitbit.experience + user.attributes.experience));
    $scope.calculatedData.requiredXp = util.nextLevelExp(user.attributes.level);
    $scope.calculatedData.strength = user.attributes.strength + user.fitbit.strength;
    $scope.calculatedData.vitality = user.attributes.vitality + user.fitbit.vitality;
    $scope.calculatedData.dexterity = user.attributes.dexterity + user.fitbit.dexterity;
    $scope.calculatedData.endurance = user.attributes.endurance + user.fitbit.endurance;
    $scope.calculatedData.maxHp = util.vitalityToHp($scope.calculatedData.vitality,'strength'); //change to $scope.user.characterClass
    user.attributes.HP += user.fitbit.HPRecov;
    user.fitbit.HPRecov = 0;
    if (user.attributes.HP > $scope.calculatedData.maxHP) {
      user.attributes.HP = $scope.calculatedData.maxHP;
    }
  };

  var alertBattleStatus = function() {
    $scope.alerts = [];
    var listOfIndices = [];
    var alertWin = false;
    var alertLoss = false;
    var alertRequest = false;
    for (var i=0; i<$rootScope.user.missionsVersus.length; i++) {
      var mission = $rootScope.user.missionsVersus[i];
      if (mission.type === 'battle') {
        if (mission.status === 'win' && !alertWin) {
          alertWin = true;
          $scope.addAlert(mission.status);
        } else if (mission.status === 'loss' && !alertLoss) {
          alertLoss = true;
          $scope.addAlert(mission.status);
        } else if (mission.status === 'request' && !alertRequest) {
          alertRequest = true;
          $scope.addAlert(mission.status);
        }

        if (mission.status === 'win' || mission.status === 'loss') {
          listOfIndices.push(i);
        }
      }
    }

    var removeMission = function(index,count) {
      if (count < listOfIndices.length) {
        $rootScope.user.missionsVersus.splice(index-count,1);
        removeMission(listOfIndices[count+1],count+1);
      }
    };

    if (listOfIndices.length > 0) {
      removeMission(listOfIndices[0],0);
    }

  };

  var localUserId = localStorageService.get('userId'); //'2Q2TVT'; //

  User.get({id : localUserId}, function (user) {
    $rootScope.user = user;
    calculateData($rootScope.user);

    alertBattleStatus();

    User.update($rootScope.user);
    clearTimeout(loading);
    $ionicLoading.hide();
  });

  $scope.refresh = function() {
    var id = localUserId; //localStorageService.get('userId');//
    Refresh.get({id: id}, function() { // this will tell fitbit to get new data
      User.get({id : id}, function (user) { // this will retrieve that new data
        $rootScope.user = user;
        calculateData($rootScope.user);
        alertBattleStatus();
        User.update($rootScope.user);
        // $window.alert("Successfully retrieved data for", id);
        // location.href = location.pathname; //refresh page
        $scope.$broadcast('scroll.refreshComplete');
      });
    });
  };

  $scope.hasSkillPoints = function() {
    if ($rootScope.user && $rootScope.user.attributes.skillPts) {
      return true;
    } else {
      return false;
    }
  };

  $scope.applyAttributes = function(attr) {
    $rootScope.user.attributes[attr]++;
    $rootScope.user.attributes.skillPts--;
    if (attr === 'vitality') {
      // change char class from warrior to user class
      // $rootScope.user.attributes.hp = util.vitalityToHp($rootScope.user.attributes.vitality,'warrior');
      $scope.calculatedData.maxHp = util.vitalityToHp($rootScope.user.attributes.vitality,'warrior');
    }
    // update database
    User.update($rootScope.user);
  };

  $scope.isEquipped = function(slot) {
    if ($rootScope.user && $rootScope.user.equipped[slot].inventoryId !== null) {
      return true;
    } else {
      return false;
    }
  };

  $scope.unequip = function(slot){
    var inventory = $rootScope.user.inventory;
    var inventoryId = $rootScope.user.equipped[slot].inventoryId;

    var empty = function(location) {
      $rootScope.user.equipped[location].name = '';
      $rootScope.user.equipped[location].inventoryId = null;
    };

    if (slot === 'weapon1' || slot === 'weapon2') {
      if ($rootScope.user.equipped['weapon1'].inventoryId === $rootScope.user.equipped['weapon2'].inventoryId) {
        empty('weapon1');
        empty('weapon2');
      }
    }

    empty(slot);

    var storeId;
    for (var i=0; i<inventory.length; i++) {
      if (inventory[i].id === inventoryId) {
        inventory[i].equipped = false;
        storeId = inventory[i].storeId;
      }
    }

    Shop.get({id: storeId}, function(item) {
      $rootScope.user.attributes.strength -= item.strength;
      $rootScope.user.attributes.vitality -= item.vitality;
      $rootScope.user.attributes.endurance -= item.endurance;
      $rootScope.user.attributes.dexterity -= item.dexterity;
      calculateData($rootScope.user);
      User.update($rootScope.user);
    })

  };

  $scope.equip = function(slot){
  };

  $scope.navTo = function(location) {
    $state.go('app.' + location);
  };
})
