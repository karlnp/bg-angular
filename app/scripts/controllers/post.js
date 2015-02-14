'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('PostCtrl', ['$scope', '$badgame', '$sce', '$location', '$routeParams', function ($scope, $badgame, $sce, $location, $routeParams) {
    $scope.postParams = {};
    $scope.message = '';

    $badgame.postInit().then(function(data) {
      $scope.postParams = data;
      $scope.msgId = $routeParams.msg;

      // Disable SMF forwarding, we'll handle it
      $scope.postParams.noforward = 1;
      
      $scope.message = $sce.trustAsHtml(data.message);
    });

    $scope.performPost = function() {
      // Bypass angular scope stuff here, ng-model and ng-bind-html don't play nice?
      $scope.postParams.message = $('#post-input').val();

      $badgame.handlePost($scope.postParams).then(function() {
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
