angular.module('starter.controllers', ['LocalStorageModule','ionic'])

.controller('CharacterCtrl', function($rootScope, $window,$scope, User, Refresh, localStorageService) {
  // initialize $rootScope.user to eliminate console errors before authentication
  $rootScope.user = {
    attributes: {
      gold: 0,
      experience: 0,
      vitality: 0,
      strength: 0,
      endurance: 0,
      dexterity: 0,
      level: 0,
      skillPts: 0,
    },
    equipped: {
      weapon1: '',
      weapon2: '',
      armor: '',
      accessory1: '',
      accessory2: '',
    },
    username: '',
  };
  User.get({id : localStorageService.get('userId')}, function (user) {
    $rootScope.user = user;
    debugger;
  });


  $scope.refresh = function() {
    var id = localStorageService.get('userId');
    Refresh.get({id: id}, function() { // this will tell fitbit to get new data
      User.get({id : id}, function (user) { // this will retrieve that new data
        $rootScope.user = user;
        $window.alert("Successfully retrieved data for", id);
        location.href = location.pathname; //refresh page
      });
    });
  };

  $scope.hasSkillPoints = function() {
    if ($scope.user.attributes.skillPts) {
      return true;
    } else {
      return false;
    }
  };

  $scope.applyAttributes = function(attr) {
    $scope.user.attributes[attr]++;
    $scope.user.attributes.skillPts--;
    if (attr === 'vitality') {
      // change char class from warrior to user class
      $scope.user.attributes.hp = util.updateHp($scope.user.attributes.hp,'warrior');
      $scope.user.attributes.maxHp = util.updateHp($scope.user.attributes.maxHp,'warrior');
    }
    // update database
    User.update($rootScope.user);
  };

  $scope.isEquipped = function(slot) {
    if (!$scope.user.equipped) {
      $scope.user.equipped = {
        weapon1: '',
        weapon2: '',
        armor: '',
        accessory1: '',
        accessory2: ''
      };
    }
    if ($scope.user.equipped[slot] !== '') {
      return true;
    } else {
      return false;
    }
  };

  $scope.unequip = function(slot){
    $scope.user.equipped[slot] = '';
    // set equipped status for item to false
    // update database
    User.update($rootScope.user);
  };

  $scope.equip = function(slot){
  };
})

.controller('FriendsCtrl', function($scope, User) {
  // friends is accessed from $rootScope.user
  $scope.friends = [];
  for (var i=0; i<$scope.user.friends.length; i++) {
    var friend = $scope.user.friends[i];
    User.get({id: friend}, function(user){
      $scope.friends.push(user);
    });
  }

  $scope.requestBattle = function(friendId) {
    // update $scope.battle to reflect status of pending with friend
    $scope.user.missionsVersus.push({type:'battle',enemy:friendId,status:'pending'});
    // post to database to update friends battle status
    User.update($scope.user);

    for (var i=0; i<$scope.friends.length; i++) {
      var friend = $scope.friends[i];
      if (friend['_id'] === friendId) {
        console.log('friend found: ', friend);
        friend.missionsVersus.push({type:'battle',enemy:$scope.user['_id'],status:'request'})
        User.update(friend);
      }
    }

  };
})

// not currently being used
// .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// })

.controller('AddFriendsCtrl', function($scope) {
  // friends is accessed from $rootScope.user.friends in the template
})

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
  }

  $scope.checkType = function() {
    if ($scope.inventoryItem.type.toLowerCase() === 'potion') {
      return true;
    } else {
      return false;
    }
  }
})

.controller('ShopCtrl', function($rootScope, $scope, Shop) {
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
    });
  };

  $scope.equipment = function() {
    $scope.isEquipment = true;
  };

  $scope.potion = function(id) {
    $scope.isEquipment = false;
  };

  $scope.getData();
  $scope.equipment();
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
      util.showAlert($ionicPopup, 'Item Purchased', 'Go to your inventory to equip or use your item.', 'OK', function() {});
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

.controller('BattleCtrl', function($scope, Battle, User, $ionicPopup, $q) {

  var userMissions = [];

  // make a copy of the $scope.user.missionsVersus
  for (var i=0; i<$scope.user.missionsVersus.length; i++) {
    userMissions[i] = {};
    for (var key in $scope.user.missionsVersus[i]) {
      userMissions[i][key] = $scope.user.missionsVersus[i][key];
    }
  }

  var battles = [];
  $scope.battles = [];

  // push into new array only missionsVersus with 'battle' type
  for (var i=0; i<userMissions.length; i++) {
    var mission = userMissions[i];
    if (mission.type === 'battle') {
      battles.push(mission);
    }
  }

  // get user data (profileName, level, etc.) for each battle to display on front end
  for (var i=0; i<battles.length; i++) {
    var battle = battles[i];
    if (battle.enemy) {
      User.get({id: battle.enemy}, function(user) {
        battle.userData = user;
        $scope.battles.push(battle);
      })
    }
  }

  $scope.cancelBattle = function(id) {
    // remove battle from $scope.user.battles
    var indexOfBattle;
    for(var i = 0; i < $scope.user.missionsVersus.length; i++){
      if ($scope.user.missionsVersus[i].type === 'battle' && $scope.user.missionsVersus[i].enemy === id) {
        indexOfBattle = i;
      }
    }

    $scope.user.missionsVersus.splice(indexOfBattle, 1);
    // update database for both players
    User.update($scope.user);
    User.get({id : id}, function(user){
      var index;
      for(var i = 0; i < user.missionsVersus.length; i++){
        if (user.missionsVersus[i].type === 'battle' && user.missionsVersus[i].enemy === id) {
          index = i;
        }
      }
      user.missionsVersus.splice(index, 1);
      User.update(user);
    });

    var index;
    for (var i=0; i<$scope.battles.length; i++) {
      var battle = $scope.battles[i];
      if (battle.enemy === id) {
        index = i;
      }
    }
    $scope.battles.splice(index,1);

  };

  var battleResults = function(outcome) {
    var title, body;
    if (outcome === 'win') {
      title = 'Victorious in Battle';
      body = 'Congratulations, your training has served you well. Keep up the good work! You\'ve gained experience and gold';
    } else if (outcome === 'loss') {
      title = 'Defeated in Battle';
      body = 'Sorry, you need to train more if you don\'t want to be a weakling. You\'ve lost experience and gold';
    } else {
      title = 'Draw';
      body = 'This match was too close...there was no victor.';
    }
    util.showAlert($ionicPopup, title, body, 'Continue', function() {

    })
  }

  $scope.startBattle = function(id) {
    // get the correct battle
    var battle;
    var indexOfBattle;
    for(var i = 0; i < $scope.user.missionsVersus.length; i++){
      if ($scope.user.missionsVersus[i].type === 'battle' && $scope.user.missionsVersus[i].enemy === id) {
        indexOfBattle = i;
        battle = $scope.user.missionsVersus[i];
      }
    }
    // get user attributes from database
    User.get({id : id}, function(enemy){
      var enemyBattle;
      for(var i = 0; i < enemy.missionsVersus.length; i++){
        if (enemy.missionsVersus[i].type === 'battle' && enemy.missionsVersus[i].enemy === $scope.user['_id']) {
          enemyBattle = enemy.missionsVersus[i];
        }
      }
      // use game logic to determine winner of battle
      // post battle results to database for both players
      if (util.battle($scope.user,enemy) === 'player 1 wins') {
        battle.status = 'win';
        enemyBattle.status = 'loss';
      } else if (util.battle($scope.user,enemy) === 'player 2 wins') {
        battle.status = 'loss';
        enemyBattle.status = 'win';
      } else {
        battle.status = 'tie';
        enemyBattle.status = 'tie';
      }

      util.showAlert($ionicPopup,'Challenge Accepted','Your duel to the death with '+ enemy.profile.displayName+ ' is in progress. Who will come out on top?', 'Results', function() {
        battleResults(battle.status);
      });

      $scope.user.missionsVersus.splice(indexOfBattle,1);

      var index;
      for (var i=0; i<$scope.battles.length; i++) {
        var userBattle = $scope.battles[i];
        if (userBattle.enemy === id) {
          index = i;
        }
      }
      $scope.battles.splice(index,1);

      //push to battle history model

      User.update($scope.user);
      User.update(enemy);

    });

  };

  $scope.pending = function() {
    $scope.isPending = true;

  };

  $scope.history = function(id) {
    // get data from battle history database
    // replace $scope.battles with results
    $scope.isPending = false;
    // Battle.query(function(battles){
    //   $scope.battles = battles;
    // });
  };

  $scope.historyData = [20,45,3]; //win,loss,tie get rid of hard coded data

  $scope.pending();
})

// not currently being used
// .controller('BattleDetailCtrl', function($scope, $stateParams, Battle) {
//   $scope.battle = Battle.get($stateParams.battleId);
// })

.controller('SoloMissionCtrl', function($scope, SoloMissions, User) {

  $scope.new = function() {
    $scope.soloMissions = [];
    SoloMissions.query(function(solos){
      var allSoloMissions = solos;
      var soloMission;

      //need to filter missions that are complete or greater than current user level
      for (var i=0; i< allSoloMissions.length; i++) {
        soloMission = allSoloMissions[i];
        if (soloMission.level <= user.attributes.level) {
          $scope.soloMissions.push(soloMission);
        }
      }
    })
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.soloMissions = [];
  };


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

.controller('VersusMissionCtrl', function($scope, VersusMissions) {

  $scope.new = function() {
    $scope.isComplete = false;
    VersusMissions.query(function(versusMissions) {
        $scope.versusMissions = versusMissions;
    })
  };

  $scope.complete = function() {
    // completed missions in user database
    $scope.isComplete = true;
    $scope.versusMissions = [];

    // update user in scope and database
  };

  $scope.new();

})

.controller('VersusMissionDetailCtrl', function($scope, $stateParams, VersusMissions) {
  $scope.versusMission = VersusMissions.get($stateParams.missionId);
  for(var i = 0; i < $scope.user.friends; i++){
    User.get({id : $scope.user.friends[i]}, function(friend) {
      $scope.friends.add(friend);
    })
  }

  $scope.selectFriends = function() {
    $scope.showFriends = true;
  };

  $scope.addFriend = function(id) {
    if ($scope.versusMission.friends.length < $scope.versusMission.size) {
      $scope.versusMission.friends.push(id);
    }
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
    User.query(function(users) {
      $scope.leaderboard = users;
    })
  };

  $scope.friends = function() {
    for(var i = 0; i < $scope.user.friends; i++){
      User.get({id : $scope.user.friends[i]}, function(user) {
        $scope.leaderboard.add(user);
      })
    }
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
//     localStorageService.clearAll();
//     $window.location.reload();
//   };
// })

.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function() {
    $state.go('create');
  };
})

.controller('CreateCtrl', function($scope, $state) {
  $scope.dash = function() {
    $state.go('tab.character');
  };
})

.controller('AccountCtrl', function($scope) {
});
