angular.module('starter.controllers')

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
        for (var j=0; j<battles.length; j++) {
          if (user['_id'] === battles[j].enemy) {
            battles[j].userData = user;
            $scope.battles.push(battles[j]);
          }
        }
      });
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