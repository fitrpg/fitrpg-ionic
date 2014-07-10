angular.module('mobile.feedback.controllers')

.controller('FeedbackCtrl', function($scope, $state, $ionicPopup, User, Feedback, localStorageService) {
  $scope.feedback = {
    email: '',
    message: '',
  };

  var navTo = function(location) {
    $state.go('app.' + location);
  };


  $scope.submit = function(feedback) {
    if (!localStorageService.get('rate')) {
      localStorageService.set('rate',true);
      $scope.user.attributes.gold += 500;
      User.update($scope.user);
    }

    Feedback.save({email: feedback.email, message: feedback.message, createdAt: new Date()});

    var title = 'Feedback Received';
    var body = 'We are constantly implementing new features and improving this app. Your feedback will help us greatly!';

    util.showAlert($ionicPopup,title,body,'OK',function(){
      navTo('character');
    });

  };
})
