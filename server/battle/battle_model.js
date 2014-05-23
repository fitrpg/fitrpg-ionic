'use strict'

var mongoose = require('mongoose');

var BattleSchema = new mongoose.Schema({
  _id : String,
  players : [],
  winner : String,
  createdAt : Date
});

module.exports = exports = mongoose.model('battles', BattleSchema);
