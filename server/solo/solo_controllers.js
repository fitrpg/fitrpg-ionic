'use strict'

var Solo = require('./solo_model');
var Q = require('Q');

module.exports = exports = {
  get : function (req, res, next) {
    $promise = Q.nbind(Solo.findById, Solo);
    $promise(req.param('id'))
      .then(function (solo) {
        res.json(solo);
      })
      .fail(function (reason) {
        next(reason);
      })
  },
  getSolos : function (req, res, next) {
    $promise = Q.nbind(Solo.find, Solo);
    $promise()
      .then(function (solos) {
        res.json(solos);
      })
      .fail(function (reason) {
        next(reason);
      })
  },
  post : function (req, res, next) {
    var solo = req.body.solo;
    var $promise = Q.nbind(User.create, User);
    $promise(solo)
      .then(function(id){
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  }
}
