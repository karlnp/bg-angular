'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('MainCtrl', ['$scope', 'badgame', function ($scope, badgame) {
    badgame.getBoards().then(function(data) {
      $scope.categories = data.categories;
    });
  }]);
