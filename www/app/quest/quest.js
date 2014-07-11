'use strict';

angular.module('mobile.quest', [

  'mobile.quest.controllers',
  'mobile.quest.services'
]);

angular.module('mobile.quest.controllers', ['LocalStorageModule','ionic']);
angular.module('mobile.quest.services', ['LocalStorageModule','ionic']);
