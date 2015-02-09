'use strict';

/**
 * @ngdoc overview
 * @name bgAngularApp
 * @description
 * # bgAngularApp
 *
 * Main module of the application.
 */
angular
  .module('bgAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/board/:boardId', {
        templateUrl: 'views/board.html',
        controller: 'BoardCtrl'
      })
      .when('/topic/:topicId', {
        templateUrl: 'views/topic.html',
        controller: 'TopicCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
