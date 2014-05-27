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

};