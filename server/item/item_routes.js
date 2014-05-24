'use strict'

var controller = require('./item_controllers.js');

module.exports = exports = function (router) {
  router.route('/')
    .get(controller.getItems)
    .post(controller.post);

  router.route('/id/')
    .get(controller.get);

}
