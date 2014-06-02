angular.module('starter.controllers')

.controller('CharacterCtrl', function($rootScope, $window,$scope, $state, $ionicNavBarDelegate, User, Refresh, localStorageService) {
  // initialize $rootScope.user to eliminate console errors before authentication

  $scope.calculatedData = {};

  var calculateData = function(user) {
    $scope.calculatedData.currentXp = util.currentLevelExp(user.attributes.level, user.attributes.experience);
    $scope.calculatedData.requiredXp = util.nextLevelExp(user.attributes.level);
    $scope.calculatedData.maxHp = util.vitalityToHp(user.attributes.vitality,'warrior');
    $scope.calculatedData.strength = user.attributes.strength + user.fitbit.strength;
    $scope.calculatedData.vitality = user.attributes.vitality + user.fitbit.vitality;
    $scope.calculatedData.dexterity = user.attributes.dexterity + user.fitbit.dexterity;
    $scope.calculatedData.endurance = user.attributes.endurance + user.fitbit.endurance;
  }

  if($rootScope.user === undefined) {
    $rootScope.user = {
      attributes: {},
      equipped: {},
    };
  } else {
    calculateData($rootScope.user);
  }

  var localUserId = localStorageService.get('userId'); //'2Q2TVT'; //

  if ($rootScope.user.username === undefined) {
    User.get({id : localUserId}, function (user) {
      $rootScope.user = user;
      calculateData($rootScope.user);
    });
  }


  $scope.refresh = function() {
    var id = localUserId;//localUserId; //
    Refresh.get({id: id}, function() { // this will tell fitbit to get new data
      User.get({id : id}, function (user) { // this will retrieve that new data
        $rootScope.user = user;
        calculateData($rootScope.user);
        // $window.alert("Successfully retrieved data for", id);
        // location.href = location.pathname; //refresh page
        $scope.$broadcast('scroll.refreshComplete');
      });
    });
  };

  $scope.hasSkillPoints = function() {
    if ($rootScope.user.attributes.skillPts) {
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
    if (!$rootScope.user.equipped) {
      $rootScope.user.equipped = {
        weapon1: '',
        weapon2: '',
        armor: '',
        accessory1: '',
        accessory2: ''
      };
    }
    if ($rootScope.user.equipped[slot] !== '') {
      return true;
    } else {
      return false;
    }
  };

  $scope.unequip = function(slot){
    $rootScope.user.equipped[slot] = '';
    // set equipped status for item to false
    // update database
    User.update($rootScope.user);
  };

  $scope.equip = function(slot){
  };

  $scope.navTo = function(location) {
    $state.go('app.' + location);
  };
})
