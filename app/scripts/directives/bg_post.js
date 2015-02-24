'use strict';

/*
  This directive will handle all the post processing required
  by badgame's BBC generation.

  Links are also given a custom click handler so they stay in app
*/
angular.module('bgAngularApp')
  .directive('bgpost', ['$timeout', '$location', function($timeout, $location) {
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
        $timeout(function() {
          // Vimeo
          $(element).find('.vimeo').each(function(key, val) {
            var vimeoLink = 'https://vimeo.com/' + $(val).text();
            $(val).html('<a href="' + vimeoLink + '">' + vimeoLink + '</a>');
          });

          // Youtube embed handling
          $(element).find('.youtube').each(function(key, val) {
            var ytLink = $(val).text();
            $(val).html('<a href="' + ytLink + '">' + ytLink + '</a>');
          });

          // Link wrapper
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
