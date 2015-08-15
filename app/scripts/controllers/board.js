'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('BoardCtrl', ['$scope', '$badgame' , '$routeParams', '$location', '$anchorScroll', function ($scope, $badgame, $routeParams, $location, $anchorScroll) {
    $scope.topicsPerPage = 20;

    $scope.refreshTopics = function() {
      var offset = ($scope.currentPage - 1) * $scope.topicsPerPage;
      $badgame.getTopics($routeParams.boardId, offset).then(function(data) {
        $scope.topics = data.topics;
        $scope.currentPage = data.page_info.current_page;
        $scope.topicsPerPage = data.page_info.items_per_page;
        $scope.totalItems = data.page_info.total_items;
      });
    };

    // Monitor rendering status and jump to anchor
    $scope.$on('ngRepeatFinished', function(event) {
      $anchorScroll();
    });

    $scope.pageChanged = function() {
      $location.hash('top');
      $scope.refreshTopics(); 
    };

    // Initial load of topics
    $scope.refreshTopics();
  }]);
