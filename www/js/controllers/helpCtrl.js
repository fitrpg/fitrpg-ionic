angular.module('starter.controllers')

.controller('HelpCtrl', function($scope, $stateParams, $location, $ionicScrollDelegate) {

	$scope.scrollTo = function(id){
		$location.hash(id);
		$ionicScrollDelegate.anchorScroll();
	};


	$scope.questions = [
		{question: 'What is the purpose of FitRPG?', goTo: 'purpose' },
		{question: 'How does FitRPG turn my fitness data into my character attributes?', goTo: 'convert' },
		{question: 'How can I improve my character\'s attributes?', goTo: 'attributes' },
		{question: 'How can I level up my character?', goTo: 'levelUp' },
		{question: 'What is a battle and how do I battle someone?', goTo: 'battle' },
		{question: 'How do I go on a quest?', goTo: 'quest' },
		{question: 'How often can I do a specific quest?', goTo: 'questFrequency' },
		{question: 'What are skill points and what can I do with them?', goTo: 'skillPts' },
		{question: 'What are weapons, equipment, and potions? How do I buy them?', goTo: 'purchasing' },
		{question: 'How do I add friends that don\'t show up in search?', goTo: 'addFriends' },
		{question: 'How much of my personal fitness data can my friends actually see?', goTo: 'privacy' },
		{question: 'How can I contact you with further questions or feedback?', goTo: 'feedback' }
	];

	$scope.answers = [
		{ question: 'What is the purpose of FitRPG?', id: 'purpose',
		  answer: 'FitRPG encourages a healthier lifestyle by coupling it with an RPG that turns your fitness data into skills, experience points, and HP that you can use to engage in battles against your friends. You can also go on quests to earn more gold and experience points.'
		},
		{ question: 'How does FitRPG turn my fitness data into my character attributes?', id: 'convert',
		  answer: 'By doing hella amazing things to it with magic omg yaaaay.' 
		},
		{ question: 'How can I improve my character\'s attributes?', id: 'attributes',
		  answer: 'asdfafsadfasfasdfasdfasfsafasfsafsafsdfsdfsfsdfsdfsfsfsf' },
		{ question: 'How can I level up my character?', id: 'levelUp',
		 answer: 'By doing hella amazing things to it with magic omg yaaaay.' 
		},
		{ question: 'What is a battle and how do I battle someone?', id: 'battle',
		 answer: 'By doing hella amazing things to it with magic omg yaaaay.' 
		},
		{ question: 'How do I go on a quest?', id: 'quest',
		 answer: 'By doing hella amazing things to it with magic omg yaaaay.' 
		},
		{ question: 'How often can I do a specific quest?', id: 'questFrequency',
		 answer: 'By doing hella amazing things to it with magic omg yaaaay.' 
		},
		{ question: 'What are skill points and what can I do with them?', id: 'skillPts',
		 answer: 'By doing hella amazing things to it with magic omg yaaaay.' 
		}
	];

})
