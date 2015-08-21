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
    'ui.bootstrap',
    'toastr'
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
  .config(['$routeProvider', 'toastrConfig', function ($routeProvider, toastrConfig) {
    angular.extend(toastrConfig, {
      allowHtml: true,
      maxOpened: 1,
      preventOpenDuplicates: true
    });

    $routeProvider
      .when('/categories', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/board/:boardId', {
        reloadOnSearch: false,
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
      .when('/post/:msg?', {
        templateUrl: 'views/post.html',
        controller: 'PostCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/searchresults/:offset?', {
        reloadOnSearch: false,
        templateUrl: 'views/topic.html',
        controller: 'TopicCtrl'
      })
      .otherwise({
        redirectTo: '/categories'
      });
  }]);
