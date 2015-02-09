'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('TopicCtrl', ['$scope', '$badgame', '$location', '$routeParams', function ($scope, $badgame, $location, $routeParams) {
    // Init to 40, but use server settings after loading a page
    $scope.postsPerPage = 40;
    $scope.offsetOverride = undefined;
    
    // Refresh the posts for the scope using current parameters
    $scope.refreshPosts = function() {
      var offset = $scope.offsetOverride ? 'new' : ($scope.currentPage - 1) * $scope.postsPerPage;

      // Reset override
      if($scope.offsetOverride) {
        $scope.offsetOverride = undefined;
      }

      $badgame.getPosts($routeParams.topicId, offset).then(function(data) {
        $scope.posts = data.messages;
        $scope.currentPage = data.page_info.current_page;
        $scope.postsPerPage = data.page_info.items_per_page;
        $scope.totalItems = data.page_info.total_items;
        $scope.replyUrl = data.reply_url;
      });
    };
    
    $scope.handleQuote = function(element) {
      $badgame.postUrl = element.quote_url;
      $location.path('/post');
    };

    $scope.handleReply = function() {
      $badgame.postUrl = $scope.replyUrl;
      $location.path('/post');
    };

    // Handle page changes
    $scope.pageChanged = function() {
      $scope.refreshPosts();
    };

    if($routeParams.showNew) {
      $scope.offsetOverride = true;
    }

    // Load the initial set of posts
    $scope.refreshPosts();
  }]);
