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

    $scope.appendTag = function(tag) {
      // This isn't really very angular at all, but hey, it works.
      var openTag = '[' + tag + ']';
      var closeTag = '[/' + tag + ']';

      var msgBox = $('#post-input');

      var oldMsg = msgBox.val();

      if (msgBox[0].selectionStart != msgBox[0].selectionEnd)
        {
          var newMsg = oldMsg.slice(0, msgBox[0].selectionStart) + openTag + oldMsg.slice(msgBox[0].selectionStart,
              msgBox[0].selectionEnd) + closeTag + oldMsg.slice(msgBox[0].selectionEnd, oldMsg.length);
          msgBox.val(newMsg);
          msgBox.focus();

          return;
        }

      msgBox.val(msgBox.val() + openTag + closeTag);

      var position = msgBox.val().length - closeTag.length;

      msgBox[0].focus();

      msgBox[0].selectionStart = msgBox[0].selectionEnd = position;
    };

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
