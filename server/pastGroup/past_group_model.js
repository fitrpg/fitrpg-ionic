'use strict'

var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  _id : String,
  players : [],
  winner : String,
  createdAt : Date
});

module.exports = exports = mongoose.model('pastGroups', GroupSchema);
