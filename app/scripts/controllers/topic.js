'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('TopicCtrl', ['$scope', 'badgame', '$location', '$anchorScroll', '$routeParams', 'toastr', function ($scope, badgame, $location, $anchorScroll, $routeParams, toastr) {
    // Init to 40, but use server settings after loading a page
    $scope.firstPage = true;
    $scope.unlimitedMode = false;
    $scope.maxCounter = 0;
    $scope.maxPostId = 0;
    $scope.posts = [];
    $scope.postsPerPage = 40;
    $scope.offsetOverride = undefined;
    $scope.sc = '';
    $scope.breadcrumbs = [];
    
    function getOffset() {
      return $scope.offsetOverride ? $routeParams.offset : ($scope.currentPage - 1) * $scope.postsPerPage;
    }

    // Used for infinite scrolling
    $scope.getMorePosts = function() {
      $scope.unlimitedMode = true;

      if($scope.posts.length > 0) {
        if($scope.posts.length % $scope.postsPerPage === 0) {
          $scope.currentPage++;
        }

        $scope.refreshPosts(true);
      }
    };

    // Refresh the posts for the scope using current parameters
    $scope.refreshPosts = function(appendMode) {
      var appendMode = appendMode || false;
      var offset = getOffset(); 

      // Reset override
      if($scope.offsetOverride) {
        $scope.offsetOverride = undefined;
      }

      var postGetter = $scope.searchMode ? badgame.getSearchResults : badgame.getPosts;
      var options = {
        offset: offset,
        lr_count: $scope.maxCounter + 1,
        lr_id: $scope.maxPostId,
        sc: $scope.sc
      };

      postGetter(options).then(function(data) {
        if(data.messages.length === 0) {
          $scope.currentPage--;
          return;
        }

        $scope.breadcrumbs = data.crumbs.slice(2);
        $scope.can_reply = data.can_reply ? true : false;
        $scope.uplink = $scope.breadcrumbs[0].url;
        $scope.replyUrl = data.reply_url;
        $scope.sc = data.sc;

        $scope.currentPage = data.page_info.current_page;
        $scope.postsPerPage = data.page_info.items_per_page;
        $scope.totalItems = data.page_info.total_items;

        // Append mode appends messages to existing data instead of clearing pages out
        if(appendMode) {
          // How many posts are on the current page?
          var loaded = $scope.posts.length % $scope.postsPerPage;
          
          // Check to make sure there's data to append, message length needs to be greater than loaded for new posts
          if(data.messages.length > loaded) { 
            $scope.posts.push.apply($scope.posts, data.messages.slice(loaded));
          }
        // Regular mode replcaes existing data with the current page
        } else {
          $scope.posts = data.messages;
        }
      });
    };

    $scope.postInView = function(post) {
      if(post.count > $scope.maxCounter) {
        $scope.maxCounter = post.count;
        $scope.maxPostId = post.id;
      }
    };

    // Monitor rendering status and jump to anchor
    $scope.$on('ngRepeatFinished', function(event) {
      if($scope.firstPage || !$scope.unlimitedMode) {
        $scope.firstPage = false;
        $anchorScroll();
      }
    });
    
    $scope.handleEdit = function(element) {
      badgame.postUrl = element.edit_url;
      $location.path('/post/msg' + element.id);
    }

    $scope.handleQuote = function(element) {
      badgame.postUrl = element.quote_url;
      $location.path('/post');
    };

    $scope.handleReply = function() {
      badgame.postUrl = $scope.replyUrl;
      $location.path('/post');
    };

    // Handle page changes
    $scope.pageChanged = function() {
      if($scope.searchMode) {
        $location.path('/searchresults/' + getOffset());
      } else {
        $location.path('/topic/' + $routeParams.topicId + '/' + getOffset());
      }

      $location.hash('top');
    };

    $scope.toastAuthor = function(post) {
      var info = "Registered on " + post.registered + "<br>" + "Post count: " + post.posts; 
      toastr.clear();
      toastr.info(info, post.username);
    };

    if($routeParams.offset) {
      $scope.offsetOverride = true;
    }

    if($routeParams.topicId) {
      badgame.currentTopic = $routeParams.topicId;
    }

    $scope.searchMode = $location.path().indexOf('searchresults') > -1;

    // Redirect to search page if empty query specified
    if($scope.searchMode && !badgame.searchParams.search) {
      $location.path('/search');
    }

    // Load the initial set of posts
    $scope.refreshPosts();
  }]);
