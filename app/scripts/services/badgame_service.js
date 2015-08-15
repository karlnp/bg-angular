'use strict';

angular.module('bgAngularApp')
  .factory('badgame', ['$http', '$log', '$q', '$sanitize', function($http, $log, $q, $sanitize) {
    var factory = {};

    var URL_DOMAIN = 'badgame.net';
    var URL_BASE = 'http://' + URL_DOMAIN + '/';

    var LOGIN_URL = URL_BASE + 'index.php?action=login2;json';
    var BOARD_URL = URL_BASE + 'index.php?json&board=';
    var CATEGORY_URL = URL_BASE + '?json';
    var TOPIC_URL = URL_BASE + 'index.php?json&topic=';
    var SEARCH_URL = URL_BASE + 'index.php?json&action=solrresults';

    // What topic are we currently viewing?
    factory.currentTopic = 0;
   
    // Store out path for posting (New Post, Quote, Reply)
    factory.postUrl = '';

    // Maintain search params in service
    factory.searchParams = {};

    /*
      Get available forums to post in
    */
    factory.getBoards = function () {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: CATEGORY_URL,
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    /*
      Get topics for a specified forum
    */
    factory.getTopics = function (board_id, offset) {
      var offset = offset || 0;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: BOARD_URL + board_id + '.' + offset,
        withCredentials: true 
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject();
      });

      return deferred.promise;
    };

    /*
      Get the posts for a specified topic
    */
    factory.getPosts = function (offset) {
      var offset = offset || 0;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: TOPIC_URL + factory.currentTopic + '.' + offset,
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject()
      });

      return deferred.promise;
    };

    /*
      Get the posts for a search query
    */
    factory.getSearchResults = function(offset) {
      var offset = offset || 0;
      var deferred = $q.defer();

      $http({
        data: $.param({search: factory.searchParams.search}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: 'POST',
        url: SEARCH_URL + '&start=' + offset,
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    factory.login = function(user, pass) {
      var deferred = $q.defer();

      var data = {
        user: user,
        passwrd: pass,
        cookieneverexp: 1
      };

      $http({
        method: 'POST',
        url: LOGIN_URL,
        data: $.param(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true
      }).success(function() {
        deferred.resolve(); 
      })
      .error(function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    factory.postInit = function() {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: factory.postUrl,
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    factory.handlePost = function(data) {
      var deferred = $q.defer();

      // Sanitize fields known for issues in badgame 
      var textFields = ["subject", "message", "guestname", "evtitle", "question"];
      angular.forEach(textFields, function(value, key) {
        data[value]= data[value] || '';
        data[value] = $sanitize(data[value]);
        
        // Allow some characters converted by sanitize, SMF expects them
        /*
          A whitelist would be nicer but weird to do without it affecting
          everything that uses sanitize in app.
        */
        data[value] = data[value].replace(/&#10;/g, "\n");
        data[value] = data[value].replace(/&amp;/g, "&");
        data[value] = data[value].replace(/&lt;/g, "<");
        data[value] = data[value].replace(/&gt;/g, ">");
      });

      var fd = new FormData();
      for(var key in data) {
        fd.append(key, data[key]);
      }

      $http({
        method: 'POST',
        url: data.form_action,
        data: fd,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity,
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve();
      }).error(function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    return factory;
}]);
