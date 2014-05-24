'use strict'

var controller = require('./group_controllers.js');

module.exports = exports = function(router) {
  router.route('/')
    .get(controller.getGroups)
    .post(controller.post);

  router.route('/id/')
    .get(controller.get);
}
