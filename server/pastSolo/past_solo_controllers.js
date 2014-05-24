'use strict'

var PastSolo = require('./past_solo_model');
var Q = require('Q');

module.exports = exports = {
  get : function (req, res, next) {
    $promise = Q.nbind(PastSolo.findById, PastSolo);
    $promise(req.param('id'))
      .then(function (pastSolo) {
        res.json(pastSolo);
      })
      .fail(function (reason) {
        next(reason);
      })
  },
  getPastSolos : function (req, res, next) {
    $promise = Q.nbind(PastSolo.find, PastSolo);
    $promise()
      .then(function (pastSolos) {
        res.json(pastSolos);
      })
      .fail(function (reason) {
        next(reason);
      })
  },
  post : function (req, res, next) {
    var pastSolo = req.body.pastSolo;
    var $promise = Q.nbind(PastSolo.create, PastSolo);
    $promise(pastSolo)
      .then(function(id){
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  }
}
