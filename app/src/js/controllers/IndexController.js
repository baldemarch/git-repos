(function(){
  'use strict';

  angular
      .module('git-repos.controllers')
      .controller('IndexController', IndexController);

  IndexController.$inject = [
    'GitService',
    '$scope'
  ];

  function IndexController(GitService, $scope) {
    let vm = this;
    let ng = angular;

    vm.data = {};
    vm.fn = {};
    vm.prop = {};

    $scope.reposFn = function(){
      $scope.testSuccess = true;
    };

    vm.fn = {
      getRepos: getReposFn,
      showComments: showCommentsFn,
      searchRepo: searchRepoFn,
      closeRepo: closeRepoFn
    };

    function getReposFn() {
      let searchSuccess = (response) => {
        vm.data.repos = response.data;
      };

      let searchError = (error) => {
        throw('searchError', error);
      };

      GitService.search('/repositories').then(searchSuccess, searchError);
    }

    function showCommentsFn(repo) {
      let _url = repo.comments_url;
      let _cleanUrl = _url.substring(22, _url.length );
      let _endpoint = _cleanUrl.substring(0, _cleanUrl.length - 9);

      let showCommentsSuccess = (response) => {
        vm.data.comments = response.data;
        vm.prop.id = repo.id;
      };

      let showCommentsError = (error) => {
        throw('searchError', error);
      };

      GitService.search(_endpoint).then(showCommentsSuccess, showCommentsError);
    }

    function searchRepoFn() {
      let _repo = vm.data.search;

      var searchSuccess = function(success) {
        console.log('success', success);
        vm.data.repos = success.data.items;
      };

      var searchError = function(error) {
        console.log('searchError', error);
        throw('No repos found');
      };

      GitService.search(`/search/repositories?q=${_repo}`).then(searchSuccess, searchError);

    }

    function closeRepoFn(e) {
      e.stopPropagation();
      vm.data.comments = null;
      vm.prop.id = '';
    }

    getReposFn();

  }

})();