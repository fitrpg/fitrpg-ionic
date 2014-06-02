angular.module('starter.controllers')

.controller('SelectClassCtrl',function($scope, $state, User) {

  $scope.disable = true;
  $scope.selected = function(item) {
    $scope.disable = false;
    $scope.char = item;
  };

  $scope.characterClasses = [{'text': 'Road Destroyer','value': 'runner'},
                             {'text': 'Weight Crusher', 'value': 'weightlifter'},
                             {'text': 'Jack of All Skills', 'value': 'mixed'},
                             {'text': 'Lay-z Sleeper', 'value': 'lazy'}];

  $scope.data = {
    clientSide: 'ng'
  };

  $scope.submit = function() {
    $scope.user.character = $scope.char.text;
    User.update($scope.user);
    $state.transitionTo('app.character');
  }

  $scope.disable = function() {
    if ($scope.username === '' || $scope.username === undefined ) {
      return false;
    }
    return true;
  }

});
