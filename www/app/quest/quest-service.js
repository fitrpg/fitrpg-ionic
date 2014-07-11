angular.module('mobile.quest.services')

.factory('finishQuest', function() {
  return {
    winQuest: function(user,userQuest) {
      userQuest.status = 'success';
      user.userQuest = userQuest;
      user.attributes.gold += userQuest.gold;
      return user;
    },
    loseQuest: function(user,userQuest) {
      userQuest.status = 'fail';
      user.userQuest = userQuest;
      user.attributes.gold = user.attributes.gold - Math.floor(userQuest.gold/2);
      return user;
    }
  }
});
