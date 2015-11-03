'use strict';

angular.module('bgAngularApp')
  .directive('tweets', ['$q', '$timeout', function($q, $timeout) {
    // Code from twitter to setup JS widget library
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);
     
      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };
     
      return t;
    }(document, "script", "twitter-wjs"));

    var tweetPromises = [];

    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if(scope.$first === true) {
          tweetPromises = [];
        }

        $timeout(function() {
          $(element).find(".tweet-embed").each(function() {
            // Don't embed inside of quotes
            if($(this).parents().hasClass('quote')) {
                return true;
            }

            // Convert tweet URL to embedded tweet
            var tweetUrl = $(this).text();
            var tweetId = tweetUrl.slice(tweetUrl.lastIndexOf('/') + 1);

            $(this).empty();
            tweetPromises.push(
              window.twttr.widgets.createTweet(tweetId, this)
            );
          });

          if(scope.$last === true) {
            $q.all(tweetPromises).then(function() {
              scope.$emit('tweetsComplete');
            });
          }
        });
      }
    };
  }]);
