'use strict'

var mongoose = require('mongoose');


 var SoloSchema = new mongoose.Schema({
   _id : String,
   title : String,
   description : String,
   difficulty : Number,
   level : Number,
   items : [],
   attributes : {
    gold : Number,
    experience : Number,
    vitality : Number,
    strength : Number,
    enduarance : Number,
    dexterity : Number
   }

 });

 module.exports = exports = mongoose.model('solos', SoloSchema);
