'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('TopicCtrl', ['$scope', '$badgame', '$routeParams', function ($scope, $badgame, $routeParams) {
    $scope.postsPerPage = 40;
    
    $scope.refreshPosts = function() {
      $badgame.getPosts($routeParams.topicId, ($scope.currentPage - 1) * $scope.postsPerPage).then(function(data) {
        $scope.posts = data.messages;
        $scope.currentPage = data.page_info.current_page;
        $scope.postsPerPage = data.page_info.items_per_page;
        $scope.totalItems = data.page_info.total_items;
      });
    };

    
    $scope.pageChanged = function() {
      $scope.refreshPosts();
    };

    // Load the initial set of posts
    $scope.refreshPosts();
  }]);
