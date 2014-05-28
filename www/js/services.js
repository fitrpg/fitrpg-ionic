angular.module('starter.services', ['ngResource'])

.constant('SERVER_URL', 'http://fitrpg.azurewebsites.net')

.factory('User', ['$resource', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/users/:id', {id : '@id'});
}])

.factory('Shop', ['$resource', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/items/:id', {id : '@id'});
}])

.factory('Battle', ['$resource', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/battles/:id', {id : '@id'});
}])

.factory('SoloMissions',['$resource', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/solos/:id', {id : '@id'});
}])

.factory('VersusMissions',['$resource', function($resource, SERVER_URL) {
  return $resource(SERVER_URL + '/groups/:id', {id : '@id'});
}])
