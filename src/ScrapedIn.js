const selectors = require('./selectors');

const withBaseUrl = (resource = '') => 'https://linkedin.com' + resource

class ScrapedIn {
  constructor(page) {
    this.page = page;
  }

  async loadUrl(url) {
    await this.page.goto(url, { waitUntil: 'networkidle2' });
  }

  async waitForNavigationUntilNetworkIdle() {
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  async goToLogin() {
    await this.loadUrl(withBaseUrl());
  }

  async login(email, password) {
    await this.page.type(selectors.login.email, email)
    await this.page.type(selectors.login.password, password);
    await this.page.click(selectors.login.button);
    await this.waitForNavigationUntilNetworkIdle();
  }

  async proceedToHomeIfManageAccountsPage() {
    const pageNow = await this.page.url();
    const MANAGE_ACCOUNTS_PAGE = withBaseUrl('/check/manage-account')
  
    if (pageNow === MANAGE_ACCOUNTS_PAGE) {
      await this.page.click(selectors.manageAccounts.skipButton);
      await this.waitForNavigationUntilNetworkIdle();
    }
  }

  async goToPersonalProfile() {
    await this.page.click(selectors.home.avatarName);
    await this.waitForNavigationUntilNetworkIdle();
  }

  async collectPeopleWhoViewedLinks() {
    await this.page.waitForSelector(selectors.profile.peopleWhoViewedLink);
    const links = await this.page.evaluate((selectors) => {
      const elems = document.querySelector(selectors.profile.peopleWhoViewedLink);
      return Array.from(elems.children).map(c => c.firstChild.href)
    }, selectors);
    return links;
  }

  async goToProfilePage(profileUrl) {
    await this.loadUrl(profileUrl);
  }

  async getProfileInfo() {
    await this.page.waitForSelector(selectors.profile.name)
    return this.page.evaluate((selectors) => {
      const name = document.querySelector(selectors.profile.name).children[0].textContent.trim();
      const company = document.querySelector(selectors.profile.company).children[1].textContent.trim()
      const country = Array.from(document.querySelectorAll(selectors.profile.country))[1]
        .children[0].textContent.trim()

      return {
        name,
        company,
        country,
      }
    }, selectors)
  }
}

module.exports = ScrapedIn;