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
  .run(['$rootScope', '$route', function($rootScope, $route) {
    // Image hiding variable management
    $rootScope.hideImages = localStorage.getItem('hideImages');

    $rootScope.$watch('$root.hideImages', function(newVal, oldVal) {
      if(newVal != oldVal) {
        if(newVal) {
          localStorage.setItem('hideImages', 1);
        } else {
          localStorage.removeItem('hideImages');
        }

        $route.reload();
      }
    });
  }])
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
      .when('/topic/:topicId/:offset?', {
        reloadOnSearch: false,
        templateUrl: 'views/topic.html',
        controller: 'TopicCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/post', {
        templateUrl: 'views/post.html',
        controller: 'PostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
