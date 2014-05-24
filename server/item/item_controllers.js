'use strict'

var Item = require('./item_model.js');
var Q     = require('Q');

module.exports = exports = {
  get : function(req, res, next) {
    var $promise = Q.nbind(Item.findById, Item);
    $promise(req.param('id'))
      .then(function (itrm) {
        res.json(itrm);
      })
      .fail(function (reason) {
        next(reason);
      })
  },
  getItems : function(req, res, next) {
    var $promise = Q.nbind(Item.find, Item);
    $promise()
      .then(function (groups) {
        res.json(groups);
      })
      .fail(function (reason){
        next(reason);
      })
  },
  post : function(req, res, next) {
    var $promise = Q.nbind(Item.save, Item);
    $promise(req.body.item)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      })
  }
}
