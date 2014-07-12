angular.module('mobile.select.controllers')

.controller('SelectClassCtrl',function($scope, $state, User) {

  $scope.disable = true;
  $scope.selected = function(item) {
    $scope.disable = false;
    $scope.char = item;
  };

  $scope.characterClasses = [{'text': 'Shadow Elf','value': 'endurance','description':'Endurance bonus for runners'},
                             {'text': 'Dwarf King', 'value': 'strength','description':'Strength bonus for gym goers'},
                             {'text': 'Rune Knight', 'value': 'dexterity','description':'Dexterity bonus for sports players'},
                             {'text': 'Dream Weaver', 'value': 'vitality','description':'Vitality bonus for those who sleep'}];

  $scope.data = {
    clientSide: 'ng'
  };

  $scope.submit = function() {
    $scope.user.character = $scope.char.text;
    $scope.user.characterClass = $scope.char.value;
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
