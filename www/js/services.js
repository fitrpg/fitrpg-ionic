angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Inventory', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var inventory = [
    { id: 0, name: 'Broadsword' },
    { id: 1, name: 'Crystal Sword' },
    { id: 2, name: 'Rune Blade' },
    { id: 3, name: 'Potion' },
    { id: 4, name: 'Hi-Potion' },
    { id: 5, name: 'X-Potion' }
  ];

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
    { id: 0, name: 'Nail Bat' },
    { id: 1, name: 'Leather Glove' },
    { id: 2, name: 'Protect Vest' },
    { id: 3, name: 'Talisman' },
    { id: 4, name: 'Fury Ring' }
  ];

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
    { id: 0, name: 'Amira Anuar' },
    { id: 1, name: 'Conor Fennell' },
    { id: 2, name: 'Matt Gutierrez' },
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
    { id: 0, name: 'Amira Anuar' },
    { id: 1, name: 'Conor Fennell' },
    { id: 2, name: 'Matt Gutierrez' },
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
    { id: 0, name: 'Amira Anuar' },
    { id: 1, name: 'Conor Fennell' },
    { id: 2, name: 'Matt Gutierrez' },
  ];

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
    { id: 0, name: 'Amira Anuar' },
    { id: 1, name: 'Conor Fennell' },
    { id: 2, name: 'Matt Gutierrez' },
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
    { id: 0, name: 'Amira Anuar' },
    { id: 1, name: 'Conor Fennell' },
    { id: 2, name: 'Matt Gutierrez' },
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
