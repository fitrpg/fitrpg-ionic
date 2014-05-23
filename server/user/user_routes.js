'use strict'

var controller = require('./user_controllers.js');

module.exports = exports = function (router) {
  router.route('/')
    .get(controller.getUsers)
    .post(controller.post);

  router.route('/id/')
    .get(controller.getUser);
};
