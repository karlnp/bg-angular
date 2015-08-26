'use strict';

angular.module('bgAngularApp')
  .directive('threadFinder', ['badgame', '$location', function(badgame, $location) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.selectedThread = '';

        scope.getThreads = function(query) {
          return badgame.findThreads(query).then(function(data) {
            return data;
          });
        };  

        scope.threadSelected = function(item, model, label) {
          // Reset the input on selection because it goes to a new page
          scope.selectedThread = '';

          $location.path('/topic/' + model.id + '/msg' + model.lastpostid);
          $location.hash('msg' + model.lastpostid);
        };
      },
      templateUrl: '/views/templates/thread-finder.html'
    };
  }]);
