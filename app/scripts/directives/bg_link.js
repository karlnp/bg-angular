'use strict';

angular.module('bgAngularApp')
  .directive('bglink', ['$timeout', '$location', function($timeout, $location) {
    // Query parameter extraction
    function getParam(url, name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    return {
      restict: 'A',
      link: function(scope, element, attr) {
        // Find all links in element
        $timeout(function() {
          $(element).find('a').each(function(key, val) {
            var href = $(val).attr('href');

            /*
              Attempt to extract to topic/board from badgame
              links so we route them correctly in the app.
            */
            if(href && href.indexOf('http://badgame.net') > -1) {
              var topic = getParam(href, 'topic');
              var board = getParam(href, 'board');

              // Route to topic
              if(topic) {
                $(val).bind('click', function(event) {
                  event.preventDefault();
                  var topicParams = topic.split('.');
                  $location.hash(topicParams[1]);
                  $location.path('/topic/' + topicParams[0] + '/' + topicParams[1]);
                  scope.$apply();
                });
              // Route to board
              } else if(board) {
                $(val).bind('click', function(event) {
                  event.preventDefault();
                  var boardParams = board.split('.');
                  $location.path('/board/' + boardParams[0]); 
                  scope.$apply();
                });
              }
            }
          });
        });
      }
    };
  }]);
