'use strict';

angular.module('bgAngularApp')
  .directive('ngcomplete', ['$timeout', function($timeout) {
    return {
      restict: 'A',
      link: function(scope, element, attr) {
        if(scope.$last === true) {
          $timeout(function() {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  }]);
