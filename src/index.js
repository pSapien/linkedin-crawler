const puppeteer = require('puppeteer');
const fs = require('fs');

const askCredentials = require('./askCredentials');
const ScrapedIn = require('./ScrapedIn');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepForTwoSec = () => sleep(2000);

async function main() {
  const { email, password } = await askCredentials();

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1920,1080'],
    defaultViewport: null
  });
  const page = await browser.newPage();

  const Linkedin = new ScrapedIn(page);
  await Linkedin.goToLogin();
  await Linkedin.login(email, password);
  await sleepForTwoSec();
  await Linkedin.proceedToHomeIfManageAccountsPage();
  await sleepForTwoSec();
  await Linkedin.goToPersonalProfile();
  await sleepForTwoSec();

  const peopleWhoViewedLinks = await Linkedin.collectPeopleWhoViewedLinks();
  const peopleWhoViewedProfiles = [];

  for await (const peopleWhoViewedLink of peopleWhoViewedLinks) {
    console.log(`scraping profile of link ${peopleWhoViewedLink}`);

    await Linkedin.goToProfilePage(peopleWhoViewedLink);
    const profile = await Linkedin.getProfileInfo();
    peopleWhoViewedProfiles.push(profile);

    await sleepForTwoSec();
  }

  fs.writeFile('./profile.json', JSON.stringify(peopleWhoViewedProfiles), (err) => {
    console.log('saved');
  });

  await browser.close()
}

main();
