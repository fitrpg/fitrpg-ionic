'use strict'

var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    _id : String,
    name : String,
    cost : Number,
    image : String,
    size : Number,
    modifiers : {
     gold : Number,
     experience : Number,
     vitality : Number,
     strength : Number,
     enduarance : Number,
     dexterity : Number
    },
    type : String,
    consumable : Boolean,
    sellPrice : Number,
    level : Number,
    rare : Boolean
});

module.exports = exports = mongoose.model('items', ItemSchema);
