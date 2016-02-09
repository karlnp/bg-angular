'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('PostCtrl', ['$scope', 'badgame', '$sce', '$location', '$routeParams', function ($scope, badgame, $sce, $location, $routeParams) {
    $scope.invalidPost = false;
    $scope.postParams = {};
    $scope.message = '';

    badgame.postInit().then(function(data) {
      $scope.postParams = data;
      $scope.msgId = $routeParams.msg;

      // Disable SMF forwarding, we'll handle it
      $scope.postParams.noforward = 1;
      
      $scope.message = $sce.trustAsHtml(data.message);
    }, function() {
      // Something went wrong with post init, kick user back out to root view
      // This should only occur if user manually refreshes the post view
      $location.path('/');
    });

    
    $scope.performPost = function() {
      // Bypass angular scope stuff here, ng-model and ng-bind-html don't play nice?
      $scope.postParams.message = $('#post-input').val();

      // No blank posts
      if($scope.postParams.message.length == 0) {
        $scope.invalidPost = true;
        return;
      }

      badgame.handlePost($scope.postParams).then(function() {
        // Redirect to new or to msg if specified
        if($scope.msgId) {
          $location.hash($scope.msgId);
          $location.path('/topic/' + $scope.postParams.topic + '/' + $scope.msgId);
        } else {
          $location.hash('new');
          $location.path('/topic/' + $scope.postParams.topic + '/new'); 
        }
      });
    };
  }]);
