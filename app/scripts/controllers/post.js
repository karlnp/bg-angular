'use strict';

/**
 * @ngdoc function
 * @name bgAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bgAngularApp
 */
angular.module('bgAngularApp')
  .controller('PostCtrl', ['$scope', '$badgame', '$sce', function ($scope, $badgame, $sce) {
    $scope.postParams = {};
    $scope.message = '';

    $badgame.postInit().then(function(data) {
      $scope.postParams = data;
      $scope.message = $sce.trustAsHtml(data.message);
    });

    $scope.performPost = function() {
      // Bypass angular scope stuff here, ng-model and ng-bind-html don't play nice?
      $scope.postParams.message = $('#post-input').val();

      $badgame.handlePost($scope.postParams).then(function() {
        // Redirect to post
      });;
    };
  }]);
