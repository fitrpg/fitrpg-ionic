'use strict'

var controller = require('./battle_controllers.js');

module.exports = exports = function(router) {
  router.route('/')
    .get(controller.getBattles)
    .post(controller.post);

  router.route('/id/')
    .get(controller.get);
}
