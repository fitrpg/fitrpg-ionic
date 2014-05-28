angular.module('starter.services', ['ngResource'])

/**
 * A simple example service that returns some data.
 */
.factory('User',['$resource', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // var user =
  //   {
  //     id: 0,
  //     username: 'FatChicken007',
  //     profile: {
  //       displayName: 'FatChicken007',
  //       picture: '',
  //     },
  //     attributes: {
  //       strength: 100,
  //       endurance: 30,
  //       vitality: 48,
  //       dexterity: 75,
  //       level: 10,
  //       levelXp: 3500,
  //       requiredLevelXp: 7500,
  //       hp: 375,
  //       maxHp: 450,
  //       charClass: 'Warrior',
  //       gold: 800,
  //       skillPoints: 20,
  //       weapon1: 'Broadsword',
  //       weapon2: 'Shield',
  //       armor1: 'Breastplate',
  //       accessory1: 'Talisman',
  //       accessory2: 'Stone of Jordan',
  //     },
  //   };

  return $resource('http://fitrpg.azurewebsites.net/users/:id', {id : '@id'});
}])

.factory('Inventory', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var inventory = [
    { id: 0, name: 'Broadsword', type: 'weapon' },
    { id: 1, name: 'Crystal Sword', type: 'weapon' },
    { id: 2, name: 'Rune Blade', type: 'weapon' },
    { id: 3, name: 'Potion', type: 'potion' },
    { id: 4, name: 'Hi-Potion', type: 'potion' },
    { id: 5, name: 'X-Potion', type: 'potion' }
  ];

  for (var i=0; i<inventory.length; i++) {
    var item = inventory[i];
    if (item.type === 'weapon') {
      item['icon'] = 'icon-shield';
    } else if (item.type === 'armor') {

    } else if (item.type === 'accessory') {

    } else if (item.type === 'potion') {
      item['icon'] = 'icon-lab';
    }
  }

  return {
    all: function() {
      return inventory;
    },
    get: function(inventoryId) {
      // Simple index lookup
      return inventory[inventoryId];
    }
  }
})

.factory('Shop', function() {
  // for (var i=0; i<shop.length; i++) {
  //   var item = shop[i];
  //   if (item.type === 'weapon') {
  //     item['icon'] = 'icon-shield';
  //   } else if (item.type === 'armor') {
  //
  //   } else if (item.type === 'accessory') {
  //
  //   } else if (item.type === 'potion') {
  //     item['icon'] = 'icon-lab';
  //   }
  // }

  return $resource('http://fitrpg.azurewebsites.net/items/:id', {id : '@id'});
})

.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Amira Anuar', level: 2, charClass: 'Amazon' },
    { id: 1, name: 'Conor Fennell', level: 9, charClass: 'Mage' },
    { id: 2, name: 'Matt Gutierrez', level: 5, charClass: 'Warrior' },
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('AddFriends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Amira Anuar', level: 2, charClass: 'Amazon' },
    { id: 1, name: 'Conor Fennell', level: 9, charClass: 'Mage' },
    { id: 2, name: 'Matt Gutierrez', level: 5, charClass: 'Warrior' },
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Battle', ['$resource', function($resource) {
  return $resource('http://fitrpg.azurewebsites.net/battles/:id', {id : '@id'});
}])

.factory('SoloMissions', ['$resource', function($resource) {
  return $resource('http://fitrpg.azurewebsites.net/solos/:id', {id : '@id'});
}])

.factory('VersusMissions', ['$resource', function($resource) {
  return $resource('http://fitrpg.azurewebsites.net/groups/:id', {id : '@id'});
}])

.factory('Leaderboard', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var leaderboard = [
    { id: 0, name: 'Amira Anuar', level: 2, charClass: 'Amazon' },
    { id: 1, name: 'Conor Fennell', level: 9, charClass: 'Mage' },
    { id: 2, name: 'Matt Gutierrez', level: 5, charClass: 'Warrior' },
  ];

  return {
    all: function() {
      return leaderboard;
    },
    get: function(leaderId) {
      // Simple index lookup
      return leaderboard[leaderId];
    }
  }
});
