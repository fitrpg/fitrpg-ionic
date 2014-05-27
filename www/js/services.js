angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('User', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var user =
    {
      id: 0,
      username: 'FatChicken007',
      profile: {
        displayName: 'FatChicken007',
        picture: '',
      },
      attributes: {
        strength: 100,
        endurance: 30,
        vitality: 48,
        dexterity: 75,
        level: 10,
        levelXp: 3500,
        requiredLevelXp: 7500,
        hp: 375,
        maxHp: 450,
        charClass: 'Warrior',
        gold: 800,
        skillPoints: 20,
        weapon1: 'Broadsword',
        weapon2: 'Shield',
        armor1: 'Breastplate',
        accessory1: 'Talisman',
        accessory2: 'Stone of Jordan',
      },
    };

  return user;
})

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
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var shop = [
    { id: 0, name: 'Nail Bat', type: 'weapon'  },
    { id: 1, name: 'Leather Glove', type: 'weapon'  },
    { id: 2, name: 'Protect Vest', type: 'weapon'  },
    { id: 3, name: 'Talisman', type: 'weapon'  },
    { id: 4, name: 'Fury Ring', type: 'weapon'  },
    { id: 5, name: 'Potion', type: 'potion' },
    { id: 6, name: 'Hi-Potion', type: 'potion' },
    { id: 7, name: 'X-Potion', type: 'potion' }
  ];

  for (var i=0; i<shop.length; i++) {
    var item = shop[i];
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
      return shop;
    },
    get: function(shopId) {
      // Simple index lookup
      return shop[shopId];
    }
  }
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

.factory('Battle', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var battles = [
    { id: 0, name: 'Amira Anuar', level: 2, charClass: 'Amazon', status: 'waiting' },
    { id: 1, name: 'Conor Fennell', level: 9, charClass: 'Mage', status: 'request' },
    { id: 2, name: 'Matt Gutierrez', level: 5, charClass: 'Warrior', status: 'waiting' },
  ];

  return {
    all: function() {
      return battles;
    },
    get: function(battleId) {
      // Simple index lookup
      return battles[battleId];
    }
  }
})

.factory('SoloMissions', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var soloMissions = [
    { id: 0, name: 'Andariel', type: 'boss', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 1, name: 'Duriel', type: 'boss' },
    { id: 2, name: 'Mephisto', type: 'boss' },
    { id: 3, name: '5k Steps', type: 'quest' },
    { id: 4, name: '10k Steps', type: 'quest' },
    { id: 5, name: '15k Steps', type: 'quest' },
  ];

  for (var i=0; i<soloMissions.length; i++) {
    var mission = soloMissions[i];
    if (mission.type === 'boss') {
      mission['icon'] = 'icon-wyvern';
    } else if (mission.type === 'quest') {
      mission['icon'] = 'icon-locked-fortress';
    }
  }

  return {
    all: function() {
      return soloMissions;
    },
    get: function(soloMissionId) {
      // Simple index lookup
      return soloMissions[soloMissionId];
    }
  }
})

.factory('VersusMissions', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var versusMissions = [
    { id: 0, name: '5k Steps', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', friends:['Amira','Conor']  },
    { id: 1, name: '10k Steps' },
    { id: 2, name: '15k Steps' },
  ];

  return {
    all: function() {
      return versusMissions;
    },
    get: function(versusMissionId) {
      // Simple index lookup
      return versusMissions[versusMissionId];
    }
  }
})

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
