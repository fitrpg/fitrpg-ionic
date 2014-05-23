'use strict'

var controller = require('./solo_controllers.js');

module.exports = exports = function (router) {
  router.route('/')
    .get(controller.getSolos)
    .post(controller.post);

  router.route('/id/')
    .get(controller.get)
}
