'use strict'

var controller = require('./past_solo_controllers.js');

module.exports = exports = function (router) {
  router.route('/')
    .get(controller.getPastSolos)
    .post(controller.post);

  router.route('/id/')
    .get(controller.get)
}
