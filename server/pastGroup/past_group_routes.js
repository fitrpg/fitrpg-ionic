'use strict'

var controller = require('./past_group_controllers.js');

module.exports = exports = function(router) {
  router.route('/')
    .get(controller.getPastGroups)
    .post(controller.post);

  router.route('/id/')
    .get(controller.get);
}
