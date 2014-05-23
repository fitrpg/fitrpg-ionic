"use strict";

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id : String,
  attributes : {
    gold : Number,
    experience : Number,
    vitality : Number,
    strength : Number,
    enduarance : Number,
    dexterity : Number
  },
  character : String,
  createdAt : Date,
  fitbit : {
    steps : Number,
    sleep : Number,
    sleepQuality : String,
    veryActiveMinutes : Number,
    inactiveMinutes : Number,
    workOutLog : []
  },
  jawbone : {
    steps : Number,
    sleep : Number,
    sleepQuality : String,
    veryActiveMinutes : Number,
    inactiveMinutes : Number,
    workOutLog : []
  },
  friends: [],
  inventory: [],
  lastActive : Date,
  missionsVersus : [],
  missionsSolo : [],
  profile : {
    displayName : String,
    avatar : String
  },
  provider : String,
  username: String,

});

module.exports = exports = mongoose.model('user', UserSchema);
