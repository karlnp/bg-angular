'use strict';

angular.module('bgAngularApp')
  .factory('$badgame', ['$http', '$log', '$q', function($http, $log, $q) {
    var factory = {};

    var URL_DOMAIN = '192.168.1.145/smf';
    var URL_BASE = 'http://' + URL_DOMAIN + '/';

    var LOGIN_URL = URL_BASE + 'index.php?action=login2;json';
    var BOARD_URL = URL_BASE + 'index.php?json&board=';
    var CATEGORY_URL = URL_BASE + '?json';
    var TOPIC_URL = URL_BASE + 'index.php?json&topic=';
   
    // Store out path for posting (New Post, Quote, Reply)
    factory.postUrl = '';

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
    factory.getPosts = function (topic_id, offset) {
      var offset = offset || 0;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: TOPIC_URL + topic_id + '.' + offset,
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject()
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

      $http({
        method: 'POST',
        url: data.form_action,
        data: $.param(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true
      }).success(function(data, status, headers, config) {
        deferred.resolve();
      }).error(function() {
        console.log('error!');
        deferred.reject();
      });

      return deferred.promise;
    };

    return factory;
}]);
