'use strict';

angular.module('bgAngularApp')
  .directive('threadFinder', ['badgame', function(badgame) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.selectedThread = '';

        scope.getThreads = function(query) {
          return badgame.findThreads(query).then(function(data) {
            return data;
          });
        };  

        scope.threadSelected = function() {
          // Reset the input on selection because it goes to a new page
          scope.selectedThread = '';
        };
      },
      templateUrl: '/views/templates/thread-finder.html'
    };
  }]);
