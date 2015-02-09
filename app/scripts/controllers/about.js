'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
