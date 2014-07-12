angular.module('mobile.main.controllers')

.controller('CharacterCtrl', function(
    $rootScope,
    $scope,
    $state,
    $ionicLoading,
    $ionicNavBarDelegate,
    $ionicPopup,
    $ionicPlatform,
    User,
    Shop,
    Quests,
    TimesData,
    DatesData,
    Refresh,
    Settings,
    localStorageService,
    $window )
{
  // initialize $rootScope.user to eliminate console errors before authentication
  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  $scope.calculatedData = {};
  $scope.alertCount = 0;
  $scope.showAlert = false;

  var device = {
    isApple: ionic.Platform.isIOS(),
    isGoogle: ionic.Platform.isAndroid(),
  };

  var addAlert = function(status, name) {
    name = name || '';
    var type, msg;
    if (status === 'loss') {
      type = 'danger';
      msg = 'Looks like you need to work out more. You lost to ' + name + '.';
    } else if (status === 'win') {
      type = 'success';
      msg = 'You beat ' + name + '. You gained experience and gold.'
    } else if (status === 'request') {
      type = '';
      msg = 'Someone wants to battle you.';
    }
    $scope.alertCount++;
    $scope.alerts.push({type: type, msg: msg});
  };

  var addLevelUpAlert = function() {
    var type, msg;
    type = 'success';
    msg = 'You leveled up! You\'ve gained skill points to increase your attributes.';
    $scope.alertCount++;
    $scope.levelUpAlerts.push({type: type, msg: msg});
  };

  var addFriendRequestAlert = function() {
    var type, msg;
    type = 'success';
    msg = 'You have a new friend request. Click here to view the requests.';
    $scope.alertCount++;
    $scope.friendRequestAlerts.push({type: type, msg: msg});
  };

  var addQuestAlert = function(quest) {
    var type, msg;
    if (quest.status === 'success') {
      type = 'success';
      msg = 'You completed your quest to ' + quest.shortDesc.toLowerCase() + ' You won ' + quest.gold + " pieces!";
    } else if (quest.status === 'fail') {
      type = 'danger';
      msg = 'Sorry, you didn\'t finish your quest to ' + quest.shortDesc.toLowerCase() + ' You lost gold. Try again in a few days.'
    }
    $scope.alertCount++;
    $scope.questAlerts.push({type: type, msg: msg});
  };

  $scope.displayAlerts = function() {
    $scope.alertCount = 0;
    $scope.showAlert = true;
  }

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.closeLevelUpAlert = function(index) {
    $scope.levelUpAlerts.splice(index, 1);
  };

  $scope.closeFriendRequestAlert = function(index) {
    $scope.friendRequestAlerts.splice(index, 1);
  };

  $scope.closeQuestAlert = function(index) {
    $scope.questAlerts.splice(index, 1);
  };

  var calculateData = function(user) {
    $scope.calculatedData.currentXp = Math.floor(util.currentLevelExp(user.attributes.level, user.fitbit.experience + user.attributes.experience));
    $scope.calculatedData.requiredXp = util.nextLevelExp(user.attributes.level);
    $scope.calculatedData.strength = user.attributes.strength + user.fitbit.strength;
    $scope.calculatedData.vitality = user.attributes.vitality + user.fitbit.vitality;
    $scope.calculatedData.dexterity = user.attributes.dexterity + user.fitbit.dexterity;
    $scope.calculatedData.endurance = user.attributes.endurance + user.fitbit.endurance;
    $scope.calculatedData.maxHp = util.vitalityToHp($scope.calculatedData.vitality,$scope.user.characterClass); //change to $scope.user.characterClass
    user.attributes.HP += user.fitbit.HPRecov;
    user.fitbit.HPRecov = 0;
    if (user.attributes.HP > $scope.calculatedData.maxHp) {
      user.attributes.HP = $scope.calculatedData.maxHp;
    }
    if (user.attributes.gold < 0) {
      user.attributes.gold = 0;
    }
  };

  var alertBattleStatus = function() {
    $scope.alerts = [];
    var listOfIndices = [];
    var alertWin = false;
    var alertLoss = false;
    var alertRequest = false;
    for (var i=0; i<$rootScope.user.missionsVersus.length; i++) {
      var alertMission = function(index){
        var mission = $rootScope.user.missionsVersus[index];
        if (mission.type === 'battle') {
          if (mission.status === 'win' || mission.status === 'loss') {
            User.get({id: mission.enemy}, function(enemy){
              addAlert(mission.status,enemy.profile.displayName);
            });
            listOfIndices.push(index);
          } else if (mission.status === 'request' && !alertRequest) {
            alertRequest = true;
            addAlert(mission.status);
          }
        }
      };
      alertMission(i);
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

  var alertLevelUpStatus = function() {
    $scope.levelUpAlerts = [];
    var userLevel = localStorageService.get('level');
    var currentLevel = $rootScope.user.attributes.level;
    if (!userLevel) {
      userLevel = localStorageService.set('level',1);
    }
    if (userLevel < currentLevel) {
      localStorageService.set('level', currentLevel);
      addLevelUpAlert();
    }
  };

  var alertFriendRequestStatus = function() {
    $scope.friendRequestAlerts = [];
    var alertRequest = false;
    if ($rootScope.user.friendRequests) {
      for (var i=0; i<$rootScope.user.friendRequests.length; i++) {
        var request = $rootScope.user.friendRequests[i];
        if (request.status === 'request' && !alertRequest) {
          alertRequest = true;
          addFriendRequestAlert();
        }
      }
    }
  };

  var alertQuestStatus = function() {
    $scope.questAlerts = [];
    var today = parseInt(Date.parse(new Date()));
    for (var j =0; j< $rootScope.user.quests.length; j++) {
      (function(i) {
        var quest = $rootScope.user.quests[i];
        if (quest.status === 'active') {
          var completeDate = parseInt(Date.parse(quest.completionTime));
          if (today >= completeDate) {
            if (quest.numDays < 1) {
              TimesData.get(quest.getObj, function(result) {
                var total = result.total;
                if (total >= quest.winGoal) {
                  $rootScope.user.quests[i].status = 'success';
                  $rootScope.user.attributes.gold += quest.gold;
                } else {
                  $rootScope.user.quests[i].status = 'fail';
                  $rootScope.user.attributes.gold = $rootScope.user.attributes.gold - Math.floor(quest.gold/3);
                }
                User.update($rootScope.user);
                addQuestAlert(quest);
              });
            } else if (quest.numDays > 0 ) {
              DatesData.get(quest.getObj, function(result) {
                var total = result.total;
                if (total >= quest.winGoal) {
                  $rootScope.user.quests[i].status = 'success';
                  $rootScope.user.attributes.gold += quest.gold;
                } else {
                  $rootScope.user.quests[i].status = 'fail';
                  $rootScope.user.attributes.gold = $rootScope.user.attributes.gold - Math.floor(quest.gold/3);
                }
                User.update($rootScope.user);
                addQuestAlert(quest);
              });
            }
          }
        }
      }(j));
    }
  };

  var setWeapons = function() {
    var defaultWeapon = function(location) {
      $rootScope.user.equipped[location] = {};
      $rootScope.user.equipped[location].name = '';
      $rootScope.user.equipped[location].inventoryId = null;
    };

    if (!$rootScope.user.equipped) {
      $rootScope.user.equipped = {};
      defaultWeapon('weapon1');
      defaultWeapon('weapon2');
      defaultWeapon('armor');
      defaultWeapon('accessory1');
      defaultWeapon('accessory2');
    }
  }

  var localUserId = localStorageService.get('userId'); //'2Q2TVT'; //

  var checkNewData = function() {
    User.get({id : localUserId}, function (user) {
      $rootScope.user = user;
      setWeapons();
      getSettings();
      if (user.needsUpdate === true) {
        Refresh.get({id:localUserId}, function() {
          User.get({id:localUserId}, function(user) {
            console.log('needed a new update');
            $rootScope.user = user;
            calculateData($rootScope.user);
            alertBattleStatus();
            alertLevelUpStatus();
            alertFriendRequestStatus();
            alertQuestStatus();
            $rootScope.user.needsUpdate = false;
            User.update($rootScope.user);
            clearTimeout(loading);
            $ionicLoading.hide();
          });
        });
      } else {
        console.log('did not need a new update');
        alertBattleStatus();
        calculateData($rootScope.user);
        User.update($rootScope.user);
        clearTimeout(loading);
        $ionicLoading.hide();
      }
    });
  }

  var refresh = function() {
    console.log('refreshing');
    Refresh.get({id: localUserId}, function() { // this will tell fitbit to get new data
      User.get({id : localUserId}, function (user) { // this will retrieve that new data
        $rootScope.user = user;
        calculateData($rootScope.user);
        $scope.alertCount = 0;
        $scope.showAlert = false;
        alertBattleStatus();
        alertLevelUpStatus();
        alertFriendRequestStatus();
        User.update($rootScope.user);
        $scope.$broadcast('scroll.refreshComplete');
      });
    });
    getSettings();
  };

  $scope.refresh = refresh;

  checkNewData();
  document.addEventListener("resume", checkNewData, false); //whenever we resume the app, retrieve new data if there is any

  $scope.hasSkillPoints = function() {
    if ($rootScope.user && $rootScope.user.attributes.skillPts > 0) {
      return true;
    } else {
      return false;
    }
  };

  $scope.applyAttributes = function(attr) {
    if ($rootScope.user.attributes.skillPts > 0) {
      $rootScope.user.attributes[attr]++;
      $rootScope.user.attributes.skillPts--;
      if (attr === 'vitality') {
        // change char class from warrior to user class
        // $rootScope.user.attributes.hp = util.vitalityToHp($rootScope.user.attributes.vitality,'warrior');
        $scope.calculatedData.maxHp = util.vitalityToHp($rootScope.user.attributes.vitality,'warrior');
      }
      calculateData($rootScope.user);
      // update database
      User.update($rootScope.user);
    }
  };

  $scope.isEquipped = function(slot) {
    var user = $rootScope.user;
    if (user && user.equipped[slot].inventoryId !== null) {
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

  var showIncentive = false;

  var getSettings = function() {
    var platform;
    if (device.isApple) {
      platform = 'ios';
    } else if (device.isGoogle) {
      platforom = 'android'
    }
    Settings.get( { platform: platform }, function(item) {
      showIncentive = item.incentive;
    });
  };

  getSettings();

  var kickstarterAlert = function() {
    var title = 'Support Us!';
    var body = 'Please help us make FitRPG even better. Support our Kickstarter campaign so we can create a more immersive storyline, a more RPG-like gameplay, and add amazing graphics! We appreciate your help.';
    var supportBtn = 'Support';
    var remindBtn = 'Cancel';

    util.showPrompt($ionicPopup,title,body,supportBtn,remindBtn,
      function(){
        $window.open('https://www.kickstarter.com/projects/435971909/fitrpg-gamifying-fitness-trackers-fitbit-for-ios-a', '_system');
        localStorageService.set('support',true);
      },
      function(){
        localStorageService.set('support',true);
      }
    );
  };

  if (!localStorageService.get('support')) {
    kickstarterAlert();
  }

  $scope.rateApp = function() {
    var title = 'Having Fun?';
    var body;
    if (localStorageService.get('rate') || !showIncentive) {
      body = 'Let us know what you think and what features you want added!';
    } else {
      body = 'Leave some feedback for us and get 500 GOLD! Good or bad we want to hear from you so we can continue to add to and improve the game.';
    }
    var likeBtn = '<i class="icon ion-thumbsup"></i>';
    var hateBtn = '<i class="icon ion-thumbsdown"></i>';
    var cancelBtn = '<i class="icon ion-close"></i>';
    util.showPopup($ionicPopup,title,body,hateBtn,likeBtn,cancelBtn,
        function() {
          if (!localStorageService.get('rate')) {
            localStorageService.set('rate',true);
            $rootScope.user.attributes.gold += 500;
            User.update($rootScope.user);
          }
          if (device.isApple) {
            $window.open('http://itunes.apple.com/app/id887067605', '_system');
          } else if (device.isGoogle) {
            $window.open('http://play.google.com/store/apps/details?id=com.fatchickenstudios.fitrpg', '_system');
          }
        },
        function() {
          $scope.navTo('feedback');
        }
      )
  };
})
