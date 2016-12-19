import { ClientBuildPage } from './app.po';

describe('client-build App', function() {
  let page: ClientBuildPage;

  beforeEach(() => {
    page = new ClientBuildPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
