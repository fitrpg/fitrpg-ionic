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

  attack: function(first,second,count) {
    if (Math.floor(count%(first.endurance/2)) === 0) {
      if (Math.random() < 1/(1+second.dexterity/25)) {
        var strength = first.strength;
        if (Math.random() < 0.05) {
          strength *= 2;
        }
        return second.HP - strength;
      }
    }
    return second.HP;
  },

  battleTurns: function(player1Attr, player2Attr) {
    var firstAttack = Math.random();
    var count = 0;

    while (player1Attr.HP > 0 && player2Attr.HP > 0) {
      count++;
      if (firstAttack >= 0.5) {
        player2Attr.HP = this.attack(player1Attr,player2Attr,count);
        if (player2Attr.HP > 0) {
          player1Attr.HP = this.attack(player2Attr,player1Attr,count);
        } else {
          break;
        }
      } else {
        player1Attr.HP = this.attack(player2Attr,player1Attr,count);
        if (player1Attr.HP > 0) {
          player2Attr.HP = this.attack(player1Attr,player2Attr,count);
        } else {
          break;
        }
      }
    }
  },

  playerAttr: function(player) {
    return {
      strength: player.attributes.strength + player.fitbit.strength,
      endurance: player.attributes.endurance + player.fitbit.endurance,
      dexterity: player.attributes.dexterity + player.fitbit.dexterity,
      HP: player.attributes.HP,
    };
  },

  battle: function(player1, player2){
    var player1Attr = this.playerAttr(player1);
    var player2Attr = this.playerAttr(player2);

    var bonus = function(player) {
      if (player.character === 'warrior') {
        player.attributes.strength *= 1.1;
      } else if (player.character === 'amazon') {
        player.attributes.dexterity *= 1.4;
      } else if (player.character === 'elf') {
        player.attributes.endurance *= 1.1;
      }
    };

    bonus(player1);
    bonus(player2);

    this.battleTurns(player1Attr,player2Attr);
    console.log(player1Attr.HP, player2Attr.HP);

    if (player1Attr.HP > player2Attr.HP) {
      return {result:'player 1', hp: player1Attr.HP};
    } else {
      return {result:'player 2', hp: player2Attr.HP};
    }

  },

  bossBattle: function(player,boss) {
    var player1 = this.playerAttr(player);
    var count = 0;
    if (boss.difficulty !== null) {
      boss.HP = boss.vitality*10*boss.difficulty;
    } else {
      boss.HP = boss.vitality*30;
    }

    this.battleTurns(player1,boss);
    console.log(player1.HP,boss.HP);

    if (player1.HP > boss.HP) {
      return {result:'player', hp: player1.HP};
    } else {
      return {result:'boss', hp: 0};
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

  calcLevel: function(experience, currLvl) {
    var level = currLvl || 1;
    var total = experience;
    var expToLevel = function(lvl) {
      return 100*Math.pow(lvl,3) + 360*Math.pow(lvl,2) + 3500*lvl;
    };
    while (expToLevel(level) < total) {
      level++;
    }
    return level;
  },

};