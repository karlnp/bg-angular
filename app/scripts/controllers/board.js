'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('BoardCtrl', ['$scope', '$badgame' , '$routeParams', function ($scope, $badgame, $routeParams) {
    $badgame.getTopics($routeParams.boardId).then(function(data) {
      $scope.topics = data.topics;
      $scope.currentPage = data.page_info.currentPage;
      $scope.totalItems = data.page_info.totalItems;
    });
  }]);
