var util = {
  vitalityToHp: function(vitality, charClass){
    var hp;
    // change character classes
    if (charClass === 'strength' || charClass === 'endurance') {
      hp = vitality * 10;
    } else if (charClass === 'dexterity') {
      hp = vitality * 12;
    } else if (charClass === 'vitality') {
      hp = vitality * 15;
    } else {
      hp = vitality * 10;
    }

    return hp;
  },

  attack: function(first,second,count) {
    first.attackBonus = first.attackBonus || 1;
    if (Math.floor(count%(100/(first.endurance/20))) === 0) {
      if (Math.random() < 1/(1+second.dexterity/25)) {
        var strength = first.strength;
        if (Math.random() < 0.05) {
          strength *= 2;
        }
        // console.log(strength);
        return Math.floor(second.HP - strength*first.attackBonus);
      }
    }
    return second.HP;
  },

  battleTurns: function(player1Attr, player2Attr) {
    var firstAttack = Math.random();
    var count = 0;
    var characterBonus = function(player) {
      if (player.characterClass === 'strength') {
        player.strength *= 1.1;
      } else if (player.characterClass === 'dexterity') {
        player.dexterity *= 1.4;
      } else if (player.characterClass === 'endurance') {
        player.endurance *= 1.1;
      } else if (player.characterClass === 'vitality') {
        player.dexterity *= 1.2;
      }
    };

    characterBonus(player1Attr);
    characterBonus(player2Attr);

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
      attackBonus: player.fitbit.attackBonus,
    };
  },

  battle: function(player1, player2){
    var player1Attr = this.playerAttr(player1);
    var player2Attr = this.playerAttr(player2);


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
      boss.HP = boss.vitality*5*boss.difficulty;
    } else {
      boss.HP = boss.vitality*10;
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

  showPrompt: function(controller,title,body,okText,cancelText,callbackTrue,callbackFalse) {
    var confirmPopup = controller.confirm({
      title: title,
      template: body,
      okText: okText,
      cancelText : cancelText
    });
    confirmPopup.then(function(res) {
      if(res) {
        callbackTrue();
      } else if (callbackFalse) {
        callbackFalse();
      }
    });
  },

  showPopup: function(controller,title,body,btn1,btn2,cancelBtn,callbackTrue,callbackFalse) {
    var myPopup = controller.show({
      title: title,
      template: body,
      buttons: [
        {text: cancelBtn},
        {text: btn1,
          onTap: function(e) {
            return 'btn1';
          }
        },
        {text: btn2,
          onTap: function(e) {
            return 'btn2';
          }
        }
      ]
    });
    myPopup.then(function(res) {
      if(res === 'btn1') {
        callbackFalse();
      } else if (res === 'btn2') {
        callbackTrue();
      }
    });
  },

  currentLevelExp: function(lvl,exp) {
    return exp - (100*Math.pow(lvl-1,3) + 360*Math.pow(lvl-1,2) + 3500*(lvl-1));
  },

  nextLevelExp: function(lvl) {
    return (100*Math.pow(lvl,3) + 360*Math.pow(lvl,2) + 3500*lvl) - (100*Math.pow(lvl-1,3) + 360*Math.pow(lvl-1,2) + 3500*(lvl-1));
  },

  levelExp: function(lvl) {
    return 100*Math.pow(lvl-1,3) + 360*Math.pow(lvl-1,2) + 3500*(lvl-1);
  },

  calcLevel: function(experience, currLvl) {
    var level = currLvl || 1;
    var total = experience;
    var expToLevel = function(lvl) {
      return 100*Math.pow(lvl,3) + 360*Math.pow(lvl,2) + 3500*lvl;
    };
    while (expToLevel(level) <= total) {
      level++;
    }
    return level;
  },

  calcSkillPoints: function(currSkillPts, lvl, currLvl) {
    return currSkillPts + (lvl-currLvl)*5;
  },

};

// Necessary to format to the way Fitbit wants our dates
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]);
};

// Useful to add days and hours to the start time/day
Date.prototype.addDays = function(days,hours) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  if(hours) {
    date.setHours(this.getHours()+hours);
  }
  return date;
};