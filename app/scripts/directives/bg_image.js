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

        // Clear after last image in post if any
        if(scope.$last === true) {
          $timeout(function() {
            $('.post').find('img.posted-image:last').each(function() {
              $(this).after("<div class=\"clearfix\"></div>");
            });
          });
        }
      }
    };
}]);
