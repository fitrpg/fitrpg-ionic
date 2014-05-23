'use strict'

var mongoose = require('mongoose');


 var PastSoloSchema = new mongoose.Schema({
   _id : String,
   win : Boolean,
   createdAt : Date
 });

 module.exports = exports = mongoose.model('pastSolos', PastSoloSchema);
