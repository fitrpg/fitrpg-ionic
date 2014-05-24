'use strict'

var Battle = require('./battle_model.js');
var Q     = require('Q');

module.exports = exports = {
  get : function(req, res, next) {
    var $promise = Q.nbind(Battle.findById, Battle);
    $promise(req.param('id'))
      .then(function (battle) {
        res.json(battle);
      })
      .fail(function (reason) {
        next(reason);
      })
  },
  getBattles : function(req, res, next) {
    var $promise = Q.nbind(Battle.find, Battle);
    $promise()
      .then(function (battles) {
        res.json(battles);
      })
      .fail(function (reason){
        next(reason);
      })
  },
  post : function(req, res, next) {
    var $promise = Q.nbind(Battle.save, Battle);
    $promise(req.body.battle)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      })
  }
}
