angular.module('starter.controllers', ['LocalStorageModule','ionic'])

.controller('CharacterCtrl', function($scope, User, localStorageService) {
  User.get({id : localStorageService.get('userId')}, function (user) {
    $scope.user = user;
  });

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
      // change char class from warrior to user class
      $scope.user.attributes.hp = util.updateHp($scope.user.attributes.hp,'warrior');
      $scope.user.attributes.maxHp = util.updateHp($scope.user.attributes.maxHp,'warrior');
    }
    // update database
    User.update($scope.user);
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
    User.update($scope.user);
  };

  $scope.equip = function(slot){
    console.log(slot);
  };
})

.controller('FriendsCtrl', function($scope, Friends, User) {
  // add CharacterCtrl or pull updated data from database
  $scope.user = User;
  $scope.friends = Friends.all();

  $scope.requestBattle = function(id) {
    // update $scope.battle to reflect status of pending with friend
    // post to database to update friends battle status
  };
})

// not currently being used
// .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// })

.controller('AddFriendsCtrl', function($scope, AddFriends) {
  $scope.friends = AddFriends.all();
})

.controller('InventoryCtrl', function($scope, Inventory) {
  $scope.inventory = Inventory.all();
  $scope.filter = 'weapon'
})

.controller('InventoryDetailCtrl', function($scope, $stateParams, Inventory, User) {
  // add CharacterCtrl or pull updated data from database
  $scope.user = User;
  $scope.inventoryItem = Inventory.get($stateParams.inventoryId);

  $scope.addClass = function(attr) {
    if (attr > 0) {
      return 'text-green';
    } else {
      return 'text-red';
    }
  };

  $scope.sellItem = function() {
    $scope.user.attributes.gold = $scope.user.attributes.gold + $scope.inventoryItem.salePrice;
    // remove from inventory
  };

  $scope.equipItem = function() {
    if ($scope.inventoryItem.type === 'weapon') {
      if ($scope.inventoryItem.size === 1) {
        if ($scope.user.attributes.weapon1 === undefined) {
          $scope.user.attributes.weapon1 = $scope.inventoryItem.name;
          // set item status to equipped
        } else if ($scope.user.attributes.weapon2 === undefined) {
          $scope.user.attributes.weapon2 = $scope.inventoryItem.name;
          // set item status to equipped
        }
      } else if ($scope.inventoryItem.size === 2) {
        if ($scope.user.attributes.weapon1 === undefined && $scope.user.attributes.weapon2 === undefined) {
          $scope.user.attributes.weapon1 = $scope.inventoryItem.name;
          $scope.user.attributes.weapon2 = $scope.inventoryItem.name;
          //set item status to equipped
        }
      }
    }
  };

  $scope.useItem = function() {
    $scope.user.attributes.hp += $scope.inventoryItem.restore;
    // subtract quantity from inventory -> remove if quantity = 0
  }

  $scope.checkType = function() {
    if ($scope.inventoryItem.type === 'potion') {
      return true;
    } else {
      return false;
    }
  }
})

.controller('ShopCtrl', function($scope, Shop) {
  Shop.query( function (items) {
    $scope.shop = items;
  });
  $scope.filter = 'weapon'
})

.controller('ShopDetailCtrl', function($scope, $stateParams, Shop, User) {
  $scope.shopItem = Shop.get($stateParams.shopId);

  $scope.addClass = function(attr) {
    if (attr > 0) {
      return 'text-green';
    } else {
      return 'text-red';
    }
  };

  $scope.buyItem = function() {
    $scope.user.attributes.gold = $scope.user.attributes.gold - $scope.shopItem.buyPrice;
    // add to inventory
  };

  $scope.checkType = function() {
    if ($scope.shopItem.type === 'potion') {
      return true;
    } else {
      return false;
    }
  }
})

.controller('BattleCtrl', function($scope, Battle, User) {
  $scope.user = User;

  $scope.cancelBattle = function(id) {
    // remove battle from $scope.user.battles
    // update database for both players
  };

  $scope.startBattle = function(id) {
    // get user attributes from database
    // use game logic to determine winner of battle
    // post battle results to database for both players
  };

  $scope.pending = function() {
    $scope.isPending = true;
    $scope.battles = Battle.all();
  };

  $scope.history = function(id) {
    // get data from battle history database
    // replace $scope.battles with results
    $scope.isPending = false;
    $scope.battles = [];
  };

  $scope.historyData = [20,45,3]; //win,loss,tie get rid of hard coded data

  $scope.pending();
})

// not currently being used
// .controller('BattleDetailCtrl', function($scope, $stateParams, Battle) {
//   $scope.battle = Battle.get($stateParams.battleId);
// })

.controller('SoloMissionCtrl', function($scope, SoloMissions, User) {
  var user = User;

  $scope.new = function() {
    $scope.soloMissions = [];
    var allSoloMissions = SoloMissions.all();
    //need to filter missions that are complete or greater than current user level
    for (var i=0; i<allSoloMissions.length; i++) {
      var soloMission = allSoloMissions[i];
      if (soloMission.level <= user.attributes.level) {
        $scope.soloMissions.push(soloMission);
      }
    }
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.soloMissions = [];
  };

  $scope.new();
})

.controller('SoloMissionDetailCtrl', function($scope, $stateParams, SoloMissions, $ionicPopup, $timeout, $q) {
  $scope.soloMission = SoloMissions.get($stateParams.missionId);

  $scope.difficulty = function(num) {
    if ( num <= $scope.soloMission.difficulty ) {
      return true;
    } else {
      return false;
    }
  };

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Mission Started',
      template: 'You are waging war against the forces of evil...',
      okText: 'Continue'
    });
    alertPopup.then(function(res) {
      $scope.showResults();
    })
  };

  $scope.showResults = function() {
    //do game logic to see if you win
      // if win give exp and gold
        // display 'You are victorious!'
        // mark mission as complete
      // if lose display on screen
        // diplay 'You are no match for [boss name]'

    var alertPopup = $ionicPopup.alert({
      title: 'Mission Results',
      template: 'You are victorious!',
      okText: 'Close'
    });
    alertPopup.then(function(res) {
    })
  };

  $scope.startMission = function() {
    if ($scope.soloMission.type === 'boss') {
      $scope.showAlert();
    } else {
      //if solo mission is quest
        // save start time of quest
        // if accomplish goals within duration
          // display 'You have completed quest!'
        // if not
          // display 'Your quest has failed.'
    }
  };
})

.controller('VersusMissionCtrl', function($scope, VersusMissions, User) {
  var user = User;

  $scope.new = function() {
    $scope.isComplete = false;
    $scope.versusMissions = VersusMissions.all();
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.isComplete = true;
    $scope.versusMissions = [];
  };

  $scope.new();

})

.controller('VersusMissionDetailCtrl', function($scope, $stateParams, VersusMissions, Friends) {
  $scope.versusMission = VersusMissions.get($stateParams.missionId);
  $scope.friends = Friends.all();

  $scope.selectFriends = function() {
    $scope.showFriends = true;
  };

  $scope.addFriend = function(id) {
    if ($scope.versusMission.friends.length < $scope.versusMission.size) {
      $scope.versusMission.friends.push(id);
    }
    console.log($scope.versusMission.friends);
  };

  $scope.removeFriend = function(id) {
    for (var i=0; i<$scope.versusMission.friends.length; i++) {
      var friend = $scope.versusMission.friends[i];
      if (friend === id) {
        $scope.versusMission.friends.splice(i,1);
      }
    }
  };

  $scope.inParty = function(id) {
    for (var i=0; i<$scope.versusMission.friends.length; i++) {
      var friend = $scope.versusMission.friends[i];
      if (friend === id) {
        return true;
      }
    }
    return false;
  };

  $scope.requestMission = function() {
    // push notify friends of mission
  };

  // server side could check if all friends accepted mission
  // if all friend accept mission, push notify all friends that mission is starting

  $scope.checkMissionStatus = function() {
    // check start time and duration
    // if past duration check participants data
    // may need to check time intervals for when someone won?
  };

  $scope.checkMissionStatus();
})

.controller('LeaderboardCtrl', function($scope, Leaderboard, Friends) {

  $scope.all = function() {
    $scope.leaderboard = Leaderboard.all();
  };

  $scope.friends = function() {
    $scope.leaderboard = Friends.all();
  };

  $scope.all();
})

// not currently being used
// .controller('LeaderboardDetailCtrl', function($scope, $stateParams, Leaderboard) {
//   $scope.leader = Leaderboard.get($stateParams.leaderId);
// })

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
    $state.go('tab.character');
  };
})

.controller('AccountCtrl', function($scope) {
});
