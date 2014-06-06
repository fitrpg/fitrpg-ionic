angular.module('starter.controllers')

.controller('BattleCtrl', function($scope, Battle, SoloMissions, User, $ionicLoading, $ionicListDelegate, $ionicPopup, $q) {
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

    for (var i=0; i<$scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      User.get({id: friend}, function(user){
        if (user['_id']) {
          $scope.friends.push(user);
        }
        clearTimeout(loading);
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');

        for (var i=0; i<$scope.friends.length; i++) {
          var friend = $scope.friends[i];
          for (var j=0; j<battles.length; j++) {
            var battle = battles[i];
            if (friend['_id'] === battle.enemy) {
              friend.battleData = battle;
              friend.battleData.status = util.capitalize(friend.battleData.status);
            }
          }
        }
      });
    }

  }

  $scope.refresh = function() {
    $scope.friendsTab = true;
    battles = [];
    $scope.friends = [];
    listOfBattles();
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
      $ionicListDelegatecloseOptionButtons()
    });
  };

  $scope.startBattle = function(id) {
    var title, body;
    if ($scope.user.attributes.HP === 0) {
      title = 'Unfit for Battle';
      body = 'You don\'t look so good. You need to recover some of your health before you can battle again.';

      util.showAlert($ionicPopup, title, body, 'OK', function() {});
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
            if (status === 'win') {
              if (player2Xp >= player1Xp) {
                return player1AttrXp += (player2Xp - player1Xp)*0.2;
              } else {
                return player1AttrXp += (player1Xp - player2Xp)*(1/Math.log(player2Xp - player1Xp)-0.2);
              }
            } else if (status === 'loss') {
              if (player2Xp >= player1Xp) {
                return player1AttrXp += (player1Xp - player2Xp)*(1/Math.log(player2Xp - player1Xp)-0.2);
              } else {
                return player1AttrXp += (player2Xp - player1Xp)*0.2;
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
            playerWin.attributes.experience = updateExp(playerWin,playerLose,'win');
            playerLose.attributes.experience = updateExp(playerLose,playerWin,'loss');
            saveBattleResult(playerWin['_id'],playerLose['_id']);
          };

          var handleNegXp = function(player){
            var playerXp = player.fitbit.experience + player.attributes.experience;
            if (playerXp < 0) {
              player.attributes.experience = -player.fitbit.experience;
            }
          }
          if (winner.result === 'player 1') {
            adjustAttr($scope.user,enemy);
            handleNegXp(enemy);
            battle.status = 'win';
            enemyBattle.status = 'loss';
          } else if (winner.result === 'player 2') {
            adjustAttr(enemy,$scope.user);
            handleNegXp($scope.user);
            enemyBattle.status = 'win';
            battle.status = 'loss';
          }

          $scope.user.attributes.level = util.calcLevel($scope.user.fitbit.experience + $scope.user.attributes.experience);

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
        var battleInfo = {type:'battle',enemy:id,status:'pending'}
        $scope.user.missionsVersus.push(battleInfo);
        User.update($scope.user);

        for (var i=0; i<$scope.friends.length; i++) {
          var friend = $scope.friends[i];
          if (friend['_id'] === id) {
            var battle = {type:'battle',enemy:$scope.user['_id'],status:'request'}
            friend.missionsVersus.push(battle);
            friend.battleData = battleInfo;
            User.update(friend);
            friend.battleData.status = util.capitalize(friend.battleData.status);
          }
        }
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
    $scope.friendsTab = false;
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
            if (completedBattle['_id'] === soloMission['_id']) {
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

  $scope.completeBossFights = function() {
    // completed missions in user database
    $scope.soloMissions = [];
    for (var i=0; i<$scope.user.battles.length; i++) {
      var completedBattle = $scope.user.battles[i];
      SoloMissions.get({id: completedBattle['_id']}, function(battle) {
        $scope.soloMissions.push(battle);
      });
    }

  };

  $scope.pending();
})