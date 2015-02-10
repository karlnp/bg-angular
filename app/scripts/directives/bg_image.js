'use strict';

angular.module('bgAngularApp')
  .directive('bgimage', ['$timeout', function($timeout) {
    return {
      restict: 'A',
      link: function(scope, element, attr) {
        // Hide images if user has chosen to do so
        if(scope.$last === true && localStorage.getItem('hideImages')) {
          $timeout(function() {
            $(".post img.posted-image, .signature img.posted-image").each(function() {
              var linkHtml = "<a href=\"" + $(this).attr("src") + "\">Image hidden! Click here to view!</a>";
              $(this).replaceWith(linkHtml);
            });
            $(".avatar img").css("display", "none");
          });
        }
      }
    };
}]);
