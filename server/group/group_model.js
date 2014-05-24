'use strict'

var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  _id   : String,
  title : String,
  description : String,
  attributes : {
   gold : Number,
   experience : Number,
   vitality : Number,
   strength : Number,
   enduarance : Number,
   dexterity : Number
 },
 bet : Number

});

module.exports = exports = mongoose.model('groups', GroupSchema);
