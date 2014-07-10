angular.module('mobile.help.controllers')

.controller('HelpCtrl', function($scope, $stateParams, $location, $ionicScrollDelegate) {

  $scope.scrollTo = function(id){
    $location.hash(id);
    $ionicScrollDelegate.anchorScroll(true)
  };

  $scope.scrollTop = function() {
      $ionicScrollDelegate.scrollTop(true);
  };


  $scope.questions = [
    {question: 'What is the purpose of FitRPG?', goTo: 'purpose' },
    {question: 'How does FitRPG turn my fitness data into my character attributes?', goTo: 'convert' },
    {question: 'How can I improve my character\'s attributes?', goTo: 'attributes' },
    {question: 'How can I level up my character?', goTo: 'levelUp' },
    {question: 'What is a battle and how do I battle someone?', goTo: 'battle' },
    {question: 'What is a quest and how does it work?', goTo: 'quest' },
    {question: 'How often can I do a specific quest?', goTo: 'questFrequency' },
    {question: 'What are skill points and what can I do with them?', goTo: 'skillPts' },
    {question: 'How do attributes help me in battle?', goTo: 'attributeDef' },
    {question: 'What are weapons, equipment, and potions? How do I buy them?', goTo: 'purchasing' },
    {question: 'What can I do with the weapons I buy?', goTo: 'weapons' },
    {question: 'What is weapon size?', goTo: 'weaponsize' },
    {question: 'How do I equip my character with weapons I\'ve bought?', goTo: 'equip' },
    {question: 'How do I add friends that don\'t show up in search?', goTo: 'addFriends' },
    {question: 'How does FitRPG retrieve my Fitbit data, and how do I make sure it is synced?', goTo: 'fitbitdata' },
    {question: 'How much of my personal fitness data can my friends actually see?', goTo: 'privacy' },
    {question: 'How can I contact you with further questions or feedback?', goTo: 'feedback' }
  ];

  $scope.answers = [
    { question: 'What is the purpose of FitRPG?', id: 'purpose',
      answer: 'FitRPG encourages a healthier lifestyle by coupling it with an RPG that turns your fitness data into skills, experience points, and HP that you can use to engage in battles against your friends. You can also go on quests to earn more gold and experience points.'
    },
    { question: 'How does FitRPG turn my fitness data into my character attributes?', id: 'convert',
      answer: 'We only start using the data you have from the day you signed up with FitRPG. We don\'t want people to come in with too much of an advantage. We use fun and fancy algorithms to turn your data into points. Steps are converted to experience; sleep is converted to vitality and HP recovery; distance is converted to endurance; and the workouts you log manually are converted to strength or dexterity. Your level is based off of your attributes and the points you win in the game.'
    },
    { question: 'How can I improve my character\'s attributes?', id: 'attributes',
      answer: 'More steps! Also more sleep and logging your workouts will improve your character\'s other attributes. Going on quests or battling friends/bosses will also win you skill points you can convert to attribute points.'
    },
    { question: 'How can I level up my character?', id: 'levelUp',
     answer: 'You level up when you gain experience through steps, battles, or quests.'
    },
    { question: 'What is a battle and how do I battle someone?', id: 'battle',
     answer: 'A battle is a one-to-one fight where your attributes are stacked up against your friend or the boss\'s attributes. Our game decides who is the most FIT and who deserves to win.'
    },
    { question: 'What is a quest and how does it work?', id: 'quest',
     answer: 'Quests are ways to motivate you to accomplish specific fitness goals. There are four categories of quests: Steps, distance, sleep, and strength training. They all have their own time limits that range from a few hours to a week. You choose what you want to do and you can continuously check your progress. Once your time has expired, if you\'ve completed the quest, you gain gold and experience points. If not, you lose some.'
    },
    { question: 'How often can I do a specific quest?', id: 'questFrequency',
     answer: 'We only let you do a quest once a week, and we only let you do one of each type of quest at a time.'
    },
    { question: 'What are skill points and what can I do with them?', id: 'skillPts',
     answer: 'You gain skill points through leveling up. Each point you get is one you can add to your endurance, dexterity, strength, or vitality. When you have skill points, you will see a small plus button next to your attributes on your dashboard, and you can tap it to increase that attribute.'
    },
    { question: 'How do attributes help me in battle?', id: 'attributeDef',
     answer: 'Strength increases your attack damage. Dexterity increases your evasion rate. Endurance increases your attack rate. Vitality increases your max HP.'
    },
    { question: 'What are weapons, equipment, and potions? How do I buy them?', id: 'purchasing' ,
     answer: 'You can equip your character with weapons and equipment to give yourself a better chance to beat bosses or friends. To buy them you have to have gold that you\'ve won from quests or battles. Go to the store from the side menu. You can buy multiples of the same item'
    },
    { question: 'What can I do with the weapons I buy?', id: 'weapons',
      answer: 'Weapons will increase some of your attributes. Depending on the weapon, your strength/dexterity/endurance/vitality may increase by a certain number, to give you an advantage when battling a stronger friend or boss.'
    },
    { question: 'What is weapon size?', id: 'weaponsize',
      answer: 'The weapon size is the amount of slots a weapon will take up when equipped. A two-handed weapon will take two slots while a one-handed weapon will take only one slot and therefore two one-handed weapons can be equipped.'
    },
    { question: 'How do I equip my character with weapons I\'ve bought?', id: 'equip' ,
     answer: 'You can equip your character with weapons and equipment to give yourself a better chance to beat bosses or friends. To buy them you have to have gold that you\'ve won from quests or battles. Go to the store from the side menu.'
    },
    { question: 'How do I add friends that don\'t show up in search?', id: 'addFriends',
      answer: 'You can either add friends through Fitbit and if they have our app, they will show up in your friends page. Otherwise, as long as they also have FitRPG installed, you can find them through going to friends and tapping the icon in the top right to search.'
    },
      { question: 'How does FitRPG retrieve my Fitbit data, and how do I make sure it is synced?', id: 'fitbitdata',
        answer: 'Every time you log in, we retrieve new data from Fitbit. You also have to refresh to see updated data when you sync with Fitbit. To refresh, just drag down the page and the refresh icon will appear at the top, while the app retrieves your updated data.'
      },
    { question: 'How much of my personal fitness data can my friends actually see?', id: 'privacy',
      answer: 'Your friends cannot see any of your actual fitness data or even your attributes right now. They can only see what level you are, your username, and your picture (and how you rank in the leaderboard ;)!)'
    },
    { question: 'How can I contact you with further questions or feedback?', id: 'feedback',
      answer: 'Email us at FitRPG@gmail.com for anything we may have missed!'
    }
  ];

});
