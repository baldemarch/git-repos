describe('Git Service', () => {
  var GitService;

  beforeEach(() => {
    module('git-repos.services');

    inject((_GitService_) => {
      GitService = _GitService_;
    });
  });

  it('Should be defined', () => {
    expect(GitService).toBeDefined();
  });

  describe('Method: search', () => {
    it('Should be defined', () => {
      expect(GitService.search).toBeDefined();
    });

  });

});