angular.module('starter.controllers')

.controller('BattleCtrl', function($scope, Battle, $ionicScrollDelegate, SoloMissions, User, $ionicLoading, $ionicListDelegate, $ionicNavBarDelegate, $ionicPopup, $q) {
  $scope.friendsTab = true;

  var loading = setTimeout(function(){
    $ionicLoading.show({
      template: '<p>Loading...</p><i class="icon ion-loading-c"></i>'
    });
  }, 500);

  var listOfBattles = function() {
    // make a copy of the $scope.user.missionsVersus
    for (var i=0; i<$scope.user.missionsVersus.length; i++) {
      battles[i] = {};
      for (var key in $scope.user.missionsVersus[i]) {
        battles[i][key] = $scope.user.missionsVersus[i][key];
      }
    }

    var getFriendData = function(id) {
      User.get({id: id}, function(user){
        if (user['_id']) {
          $scope.friends.push(user);
          var friend = $scope.friends[$scope.friends.length-1];
          for (var j=0; j<battles.length; j++) {
            var battle = battles[j];
            if (friend['_id'] === battle.enemy) {
              friend.battleData = battle;
              friend.battleData.status = util.capitalize(friend.battleData.status);
            }
          }
          console.log(friend);
        }
        clearTimeout(loading);
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    for (var i=0; i<$scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      getFriendData(friend);
    }

    for (var i=0; i<$scope.user.missionsVersus.length; i++) {
      var enemy = $scope.user.missionsVersus[i].enemy;
      var friendExists = false;
      for (var j=0; j<$scope.user.friends.length; j++) {
        var friend = $scope.user.friends[j];
        if (enemy === friend) {
          friendExists = true;
        }
      }
      if (!friendExists) {
        getFriendData(enemy);
      }
    }

  };

  $scope.refresh = function() {
    battles = [];
    $scope.friends = [];
    listOfBattles();
  };

  $scope.showHistory = true;
  $scope.friendTab = 'button-tab-active';
  $scope.friendsBattle = function() {
    $ionicScrollDelegate.scrollTop();
    $scope.isPending = true;
    $scope.showHistory = true;
    $scope.friendTab = 'button-tab-active';
    $scope.bossTab = '';
    $scope.friendsTab = true;
    $scope.refresh();
  };

  $scope.refresh();

  $scope.cancelBattle = function(id) {
    // remove battle from $scope.user.battles
    var removeMission = function(player,playerId) {
      var indexOfBattle;
      for(var i = 0; i < player.missionsVersus.length; i++){
        if (player.missionsVersus[i].enemy === playerId) {
          indexOfBattle = i;
        }
      }

      player.missionsVersus.splice(indexOfBattle, 1);
      User.update(player);
    };

    removeMission($scope.user,id);

    // get enemy data and remove missions versus
    User.get({id : id}, function(user){
      removeMission(user,$scope.user['_id'])
    });

    for (var i=0; i<$scope.friends.length; i++) {
      var friend = $scope.friends[i];
      if (friend['_id'] === id) {
        delete friend.battleData;
      }
    }
    $ionicListDelegate.closeOptionButtons();
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
      $ionicListDelegate.closeOptionButtons();
    });
  };

  $scope.startBattle = function(id) {
    var title, body;
    if ($scope.user.attributes.HP === 0) {
      title = 'Unfit for Battle';
      body = 'You don\'t look so good. You need to recover some of your health before you can battle again.';

      util.showAlert($ionicPopup, title, body, 'OK', function() {
        $ionicListDelegate.closeOptionButtons();
      });
    } else {
      var battlePending = false;
      var battleRequest = false;

      for (var i=0; i<$scope.user.missionsVersus.length; i++) {
        var mission = $scope.user.missionsVersus[i];
        if (mission.enemy === id && mission.status.toLowerCase() === 'pending') {
          battlePending = true;
        } else if (mission.enemy === id && mission.status.toLowerCase() === 'request') {
          battleRequest = true;
        }
      }
      if (battleRequest) {
        console.log('get ready for battle!');
        // get the correct battle
        var battle;
        var indexOfBattle;
        for(var i = 0; i < $scope.user.missionsVersus.length; i++){
          if ($scope.user.missionsVersus[i].enemy === id) {
            indexOfBattle = i;
            battle = $scope.user.missionsVersus[i];
          }
        }

        // get user attributes from database
        User.get({id : id}, function(enemy){
          var enemyBattle;
          for(var i = 0; i < enemy.missionsVersus.length; i++){
            if (enemy.missionsVersus[i].enemy === $scope.user['_id']) {
              enemyBattle = enemy.missionsVersus[i];
            }
          }

          // use game logic to determine winner of battle
          // post battle results to database for both players

          var winner = util.battle($scope.user,enemy);

          var updateExp = function(player1,player2,status) {
            var player1Xp = player1.attributes.experience + player1.fitbit.experience;
            var player2Xp = player2.attributes.experience + player2.fitbit.experience;
            var player1AttrXp = player1.attributes.experience;
            var player2AttrXp = player2.attributes.experience;
            var diff = Math.abs(player2Xp-player1Xp);
            if (status === 'win') {
              if (player2Xp >= player1Xp) {
                return player1AttrXp + diff*0.2;
              } else {
                return player1AttrXp + diff*(1/Math.log(diff)*0.5);
              }
            } else if (status === 'loss') {
              if (player2Xp >= player1Xp) {
                return player1AttrXp - diff*(1/Math.log(diff)*0.5);
              } else {
                return player1AttrXp - diff*0.2;
              }
            }
          };

          var saveBattleResult = function(winnerId, loserId) {
            var battle = {
              winner : winnerId,
              loser : loserId,
              createdAt : new Date()
            }

            Battle.save(battle);
          }

          var adjustAttr = function(playerWin,playerLose) {
            playerLose.attributes.HP = 0;
            playerWin.attributes.HP = winner.hp;
            playerWin.attributes.gold += Math.floor(playerLose.attributes.gold*0.1);
            playerLose.attributes.gold = Math.floor(playerLose.attributes.gold *= 0.9);
            playerWin.attributes.experience = Math.floor(updateExp(playerWin,playerLose,'win'));
            playerLose.attributes.experience = Math.floor(updateExp(playerLose,playerWin,'loss'));
            saveBattleResult(playerWin['_id'],playerLose['_id']);
          };

          var handleNegXp = function(player,level){
            var playerXp = player.fitbit.experience + player.attributes.experience;
            var levelXp = util.levelExp(level);
            if (playerXp < 0) {
              player.attributes.experience = -player.fitbit.experience;
            } else if (playerXp < levelXp) {
              player.attributes.experience += (levelXp - playerXp);
            }
          }
          if (winner.result === 'player 1') {
            adjustAttr($scope.user,enemy);
            handleNegXp(enemy, enemy.attributes.level);
            battle.status = 'win';
            enemyBattle.status = 'loss';
          } else if (winner.result === 'player 2') {
            adjustAttr(enemy,$scope.user);
            handleNegXp($scope.user, $scope.user.attributes.level);
            enemyBattle.status = 'win';
            battle.status = 'loss';
          }

          var newLevel = util.calcLevel($scope.user.fitbit.experience + $scope.user.attributes.experience);
          $scope.user.attributes.skillPts = util.calcSkillPoints($scope.user.attributes.skillPts,newLevel,$scope.user.attributes.level);
          $scope.user.attributes.level = newLevel;

          util.showAlert($ionicPopup,'Challenge Accepted','Your duel to the death with '+ enemy.profile.displayName+ ' is in progress. Who will come out on top?', 'Results', function() {
            battleResults(battle.status);
          });

          $scope.user.missionsVersus.splice(indexOfBattle,1);

          for (var i=0; i<$scope.friends.length; i++) {
            var friend = $scope.friends[i];
            if (friend['_id'] === id) {
              delete friend.battleData;
            }
          }

          User.update($scope.user);
          User.update(enemy);
        });
      } else if (battlePending) {
        title = 'Battle Pending';
        body = 'You are already have a request to do battle with this friend.';

        util.showAlert($ionicPopup, title, body, 'OK', function() {
          $ionicListDelegate.closeOptionButtons();
        });
      } else {
        var checkMissionExists = function(player,enemyId) {
          var missions = player.missionsVersus;
          for (var i=0; i<missions.length; i++) {
            var mission = missions[i];
            if (mission.enemy === enemyId) {
              return true;
            }
          }
          return false;
        };

        var battleInfo = {type:'battle',enemy:id,status:'pending'};
        User.get({id: $scope.user['_id']}, function(user) {
          var missionExists = checkMissionExists(user,id);
          if (!missionExists) {
            user.missionsVersus.push(battleInfo);
            User.update(user);
          }
        });

        User.get({id: id}, function(friend) {
          var battle = {type:'battle',enemy:$scope.user['_id'],status:'request'};
          var friendMissionExists = checkMissionExists(friend,$scope.user['_id']);
          if (!friendMissionExists) {
            friend.missionsVersus.push(battle);
            friend.battleData = battleInfo;
            User.update(friend);
            friend.battleData.status = util.capitalize(friend.battleData.status);
          }
        });

        title = 'Request Sent';
        body = 'Your battle request has been sent. You can still equip new weapons or train more until the battle request is accepted.';

        util.showAlert($ionicPopup, title, body, 'OK', function() {
          $ionicListDelegate.closeOptionButtons();
        });
      }
    }

  };

  $scope.pending = function() {
    $scope.isPending = true;
  };

  // $scope.historyData = [30, 20];
  $scope.history = function() {
    $scope.oldWinBattles = [];
    $scope.oldLossBattles = [];
    $scope.isPending = false;
    $scope.showHistory = false;
    var userId = $scope.user['_id']
    Battle.query({winner: userId}, function(battlesWon){
     Battle.query({loser: userId}, function(battlesLost){
        $scope.wins = battlesWon.length;
        $scope.losses = battlesLost.length;
        // var total = wins + losses;

        // $scope.historyData = [wins, losses];

        var oldBattles = battlesWon.concat(battlesLost);
        for (var i=0; i<battlesWon.length; i++) {
          var enemy = battlesWon[i].loser;
          User.get({id: enemy}, function(user) {
            $scope.oldWinBattles.push(user);
          });
        }
        for (var i=0; i<battlesLost.length; i++) {
          var enemy = battlesLost[i].winner;
          User.get({id: enemy}, function(user) {
            $scope.oldLossBattles.push(user);
          });
        }

      });
    });
  };

  $scope.battlePending = function(friend) {
    if (friend) {
      return true;
    }
    return false;
  };

  $scope.newBossFights = function() {
    $ionicScrollDelegate.scrollTop();
    $scope.bossTab = 'button-tab-active';
    $scope.friendTab = '';
    $scope.friendsTab = false;
    $scope.showHistory = false;
    $scope.soloMissions = [];
    SoloMissions.query(function(solos){
      var allSoloMissions = solos;
      var soloMission;

      //need to filter missions that are complete or greater than current user level
      for (var i=0; i< allSoloMissions.length; i++) {
        var battleComplete = false;
        soloMission = allSoloMissions[i];
        if (soloMission.level <= $scope.user.attributes.level && ($scope.user.attributes.level-6) < (soloMission.level)) {
          for (var j=0; j<$scope.user.battles.length; j++) {
            var completedBattle = $scope.user.battles[j];
            if (completedBattle === soloMission['_id']) {
              battleComplete = true;
            }
          }
          if (!battleComplete) {
            $scope.soloMissions.push(soloMission);
          }
        }
      }
      clearTimeout(loading);
      $ionicLoading.hide();
    });

  };

  $scope.difficulty = function(index, num) {
    if ( num <= $scope.soloMissions[index].difficulty ) {
      return true;
    } else {
      return false;
    }
  };

  $scope.completeBossFights = function() {
    // completed missions in user database
    $scope.soloMissions = [];
    for (var i=0; i<$scope.user.battles.length; i++) {
      var completedBattle = $scope.user.battles[i];
      SoloMissions.get({id: completedBattle}, function(battle) {
        $scope.soloMissions.push(battle);
      });
    }

  };

  $scope.pending();

  $scope.startMission = function(missionId) {
    $scope.soloMission = SoloMissions.get({id: missionId});
    var title, body;
    if ($scope.user.attributes.HP > 0) {
      title = 'Mission Started';
      body = 'You are waging war against the forces of evil...',

      util.showAlert($ionicPopup, title, body, 'Continue', function() {
        var winner = util.bossBattle($scope.user,$scope.soloMission);
        title = 'Mission Results';

        if (winner.result === 'player') {
          $scope.user.attributes.experience += $scope.soloMission.experience;
          $scope.user.attributes.gold += $scope.soloMission.gold;
          $scope.user.battles.push($scope.soloMission['_id']);
          var newLevel = util.calcLevel($scope.user.fitbit.experience + $scope.user.attributes.experience);
          $scope.user.attributes.skillPts = util.calcSkillPoints($scope.user.attributes.skillPts,newLevel,$scope.user.attributes.level);
          $scope.user.attributes.level = newLevel;
          body = 'You\'ve crushed evil. Go find more bad guys to defeat!';
        } else {
          body = 'You were defeated. You may want to train more before doing battle.';
        }
        $scope.user.attributes.HP = winner.hp;

        User.update($scope.user);

        util.showAlert($ionicPopup, title, body, 'OK', function(){
          $ionicListDelegate.closeOptionButtons();
        });

      });
    } else {
      title = 'Rest Up';
      body = 'You should get some rest before battle.';
      util.showAlert($ionicPopup, title, body, 'OK', function() {
        $ionicListDelegate.closeOptionButtons();
      });
    }
  };
})