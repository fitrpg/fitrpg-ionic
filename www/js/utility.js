var util = {
  updateHp: function(hp, charClass){
    // change character classes
    if (charClass === 'warrior') {
      hp += 10;
    } else if (charClass === 'amazon') {
      hp += 15;
    } else if (charClass === 'mage') {
      hp += 20;
    }

    return hp;
  },

  battle: function(player1, player2){
    var player1 = player1.attributes;
    var player2 = player2.attributes;
    var firstAttack = Math.random();
    var count = 0;

    var bonus = function(player) {
      if (player.charClass === 'warrior') {
        player.strength *= 1.1;
      } else if (player.charClass === 'amazon') {
        player.dexterity *= 1.4;
      } else if (player.charClass === 'elf') {
        player.endurance *= 1.1;
      }
    };

    bonus(player1);
    bonus(player2);

    var attack = function(first,second) {
      if (Math.floor(first.endurance/2%count) === 0) {
        if (Math.random() < 1/(1+second.dexterity/25)) {
          var strength = first.strength;
          if (Math.random() < 0.05) {
            strength *= 2
          }
          second.hp = second.hp - strength;
        }
      }
    };

    while (player1.hp > 0 && player2.hp > 0) {
      count++;
      if (firstAttack >= 0.5) {
        attack(player1,player2);
        attack(player2,player1);
      } else {
        attack(player2,player1);
        attack(player1,player2);
      }
    }

    if (player1.hp >= player2.hp) {
      return 'player 1 wins';
    } else {
      return 'player 2 wins';
    }

  },

};