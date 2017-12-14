(function(){
  'use strict';

  angular
      .module('git-repos.services')
      .service('GitService', GitService);

  GitService.$inject = [
    '$http'
  ];

  function GitService($http) {
    var _self = this;
    var api = 'https://api.github.com';

    _self.search = searchFn;

    function searchFn(endpoint) {
      var promise = $http;

      var handleSuccess = function(success) {
        return Promise.resolve(success);
      };

      var handleError = function(error) {
        return Promise.reject(error);
      };

      return promise.get(api + endpoint).then(handleSuccess, handleError);

    }

    


  }

})();