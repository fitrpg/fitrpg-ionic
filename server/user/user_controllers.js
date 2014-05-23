'use strict';

var User = require('./user_model.js');
var Q    = require('q');

module.exports = exports = {
  getUser : function (req, res, next) {
    var $promise = Q.nbind(User.findById, User);
    $promise(req.param('id'))
      .then(function (users) {
        res.json(users);
      })
      .fail(function (reason) {
          next(reason)
      })
  },
  getUsers : function (req, res, next) {
    var $promise = Q.nbind(User.find, User);
    $promise()
      .then(function (users) {
        res.json(users);
      })
      .fail(function (reason) {
          next(reason)
      })
  },
  post : function (req, res, next) {
    var user = req.body.user;
    var $promise = Q.nbind(User.create, User);
    $promise(user)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  }
};
