'use strict';

angular.module('mobile.authentication', [

  'mobile.authentication.controllers',
  'mobile.authentication.services'
]);

angular.module('mobile.authentication.controllers', ['LocalStorageModule', 'ionic']);
angular.module('mobile.authentication.services', ['LocalStorageModule', 'ionic']);
