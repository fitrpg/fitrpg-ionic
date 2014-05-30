angular.module('starter.services', ['ngResource'])

.constant('SERVER_URL', 'http://fitrpg.azurewebsites.net')

.factory('authHttpInterceptor', [function() {
 return {
   'request': function(config) {
     // do some API key setting
     // Add json web token
     return config;
   }
 };
}])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authHttpInterceptor');
}])

.factory('Refresh', ['$resource', 'SERVER_URL', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/fitbit/refresh/:id', {id: '@id'});
}])

.factory('User', ['$resource', 'SERVER_URL', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/users/:id', {id : '@id'}, {
      update: { method: 'PUT' }
  });
}])

.factory('Shop', ['$resource', 'SERVER_URL', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/items/:id', {id : '@id'});
}])

.factory('Battle', ['$resource', 'SERVER_URL', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/battles/:id', {id : '@id'});
}])

.factory('SoloMissions',['$resource', 'SERVER_URL', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/solos/:id', {id : '@id'});
}])

.factory('VersusMissions',['$resource', 'SERVER_URL', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/groups/:id', {id : '@id'});
}]);
