'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('SearchCtrl', ['$scope', 'badgame', '$location', function ($scope, badgame, $location) {
    $scope.query = '';

    $scope.search = function() {
      badgame.searchParams = {
        search: $scope.query
      };

      $location.path('/searchresults');
    };
  }]);
