describe('Index controller', () => {
  var $controller;

  beforeEach(() => {
    module('git-repos.controllers');

    inject((_$controller_) => {
      $controller = _$controller_;
    });
  });

  it('$controller should be defined', () => {
    expect($controller).toBeDefined();
  });

  describe('IndexController method: $scope.reposFn', () => {
    it('reposFn method should be defined', () => {
      var $scope = {};
      var controller = $controller('IndexController', { $scope: $scope});
      $scope.getRepos();
      expect($scope.testSuccess).toBe(true);
    });
  });
  
});