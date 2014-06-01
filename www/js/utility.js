var util = {
  vitalityToHp: function(vitality, charClass){
    var hp;
    // change character classes
    if (charClass === 'warrior') {
      hp = vitality * 10;
    } else if (charClass === 'amazon') {
      hp = vitality * 15;
    } else if (charClass === 'mage') {
      hp = vitality * 20;
    }

    return hp;
  },

  battle: function(player1, player2){
    var player1Attr = player1.attributes;
    var player2Attr = player2.attributes;
    var firstAttack = Math.random();
    var count = 0;

    var bonus = function(player) {
      if (player.character === 'warrior') {
        player.strength *= 1.1;
      } else if (player.character === 'amazon') {
        player.dexterity *= 1.4;
      } else if (player.character === 'elf') {
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

    while (player1Attr.hp > 0 && player2Attr.hp > 0) {
      count++;
      if (firstAttack >= 0.5) {
        attack(player1Attr,player2Attr);
        attack(player2Attr,player1Attr);
      } else {
        attack(player2Attr,player1Attr);
        attack(player1Attr,player2Attr);
      }
    }

    if (player1Attr.hp >= player2Attr.hp) {
      return 'player 1 wins';
    } else {
      return 'player 2 wins';
    }

  },

  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },

  showAlert: function(controller, title, body, button, callback) {
    var alertPopup = controller.alert({
      title: title,
      template: body,
      okText: button
    });
    alertPopup.then(function(res) {
      callback();
    });
  },

  currentLevelExp: function(lvl,exp) {
    return exp - (100*Math.pow(lvl-1,3) + 360*Math.pow(lvl-1,2) + 3500*(lvl-1));
  },

  nextLevelExp: function(lvl) {
    return (100*Math.pow(lvl,3) + 360*Math.pow(lvl,2) + 3500*lvl) - (100*Math.pow(lvl-1,3) + 360*Math.pow(lvl-1,2) + 3500*(lvl-1));
  },


};