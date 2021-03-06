const puppeteer = require("puppeteer-core");
const promiseAny = require("promise-any"); // TODO: Remove once Promise.any is a thing
const fs = require("fs-extra");

async function main(options) {
  let scraped = await scrape(options);

  // TODO: THIS IS NOT WELL TESTED

  // Handle the "Restart Process" conditions
  if (scraped === "AUTHENTICATED" || scraped === "CAPTCHA") {
    // Try again but override the AUTHENTICATE option to be false to prevent a loop
    scraped = await puppeteer({
      ...options,
      puppeteer: { ...options.puppeteer, AUTHENTICATE: false }
    });
  }

  return scraped;
}

// Open the browser, scrape the raw data into a JSON object
async function scrape(options) {
  const {
    SHOW_PROGRESS,
    WRITE_TO_CACHE,
    READ_FROM_CACHE,
    puppeteer: {
      CHROME_EXECUTABLE_PATH,
      CHROME_DATA_DIR,
      CHROME_ENABLE_DEVTOOLS,
      CHROME_ENABLE_HEADLESS,
      WEB_URL,

      CSS_SELECTOR_CAMPAIGN_LIST,
      CSS_SELECTOR_CAMPAIGN_LINK,
      CSS_SELECTOR_PROFILE_CARD,
      CSS_SELECTOR_PROFILE_LINK,
      CSS_SELECTOR_PROFILE_NAME,

      TAKE_SCREENSHOT,
      AUTHENTICATE,
      AUTHENTICATE_TIMEOUT
    },
    output: { SCREENSHOT_FULLPATH, CACHE_FULLPATH }
  } = options;

  SHOW_PROGRESS && console.log(`[ ] Puppeteer`);

  if (READ_FROM_CACHE) {
    SHOW_PROGRESS && console.log(`[ ]      READ_FROM_CACHE Skipping puppeteer`);
    return;
  }

  SHOW_PROGRESS && console.log(`[ ]      Opening Browser`);
  const browser = await puppeteer.launch({
    devtools: CHROME_ENABLE_DEVTOOLS,
    headless: CHROME_ENABLE_HEADLESS,
    executablePath: CHROME_EXECUTABLE_PATH,
    userDataDir: CHROME_DATA_DIR,
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });

  const page = await browser.newPage();

  SHOW_PROGRESS && console.log(`[ ]      Navigating to ${WEB_URL}`);
  await page.goto(WEB_URL, {
    waitUntil: "networkidle2",
    timeout: 0
  });

  await page.bringToFront();

  if (AUTHENTICATE) {
    await auth({ browser, page }, options);
    await browser.close();
    return "AUTHENTICATED";
  }

  const captchaRestart = await captcha({ browser, page }, options);
  if (captchaRestart) return "CAPTCHA";

  await page.waitForSelector(CSS_SELECTOR_CAMPAIGN_LIST);

  SHOW_PROGRESS && console.log(`[ ]      Page Ready`);

  if (TAKE_SCREENSHOT) {
    SHOW_PROGRESS && console.log(`[ ]      Screenshotting Campaign List`);
    const campaignList = await page.$(CSS_SELECTOR_CAMPAIGN_LIST);
    const filename = SCREENSHOT_FULLPATH();
    await campaignList.screenshot({ path: filename });
    SHOW_PROGRESS && console.log(`[ ]      Saved to ${filename}`);
  }

  // Click into campaign
  SHOW_PROGRESS && console.log(`[ ]      Clicking into Campaign`);
  await Promise.all([
    page.waitForNavigation(),
    page.click(CSS_SELECTOR_CAMPAIGN_LINK)
  ]);

  if (TAKE_SCREENSHOT) {
    SHOW_PROGRESS && console.log(`[ ]      Screenshotting Campaign Page`);
    const filename = SCREENSHOT_FULLPATH();
    await page.screenshot({ path: filename, fullPage: true });
    SHOW_PROGRESS && console.log(`[ ]      Saved to ${filename}`);
  }

  const profileCards = await page.$$(CSS_SELECTOR_PROFILE_CARD);
  SHOW_PROGRESS &&
    process.stdout.write(`[ ]      Scraping ${CSS_SELECTOR_PROFILE_CARD} `);

  const profiles = await Promise.all(
    profileCards.map(async profileCard => {
      SHOW_PROGRESS && process.stdout.write(".");

      const name = await profileCard.$(CSS_SELECTOR_PROFILE_NAME);
      const nameInnerText = await name.getProperty("innerText");
      const nameText = await nameInnerText.jsonValue();

      const link = await profileCard.$(CSS_SELECTOR_PROFILE_LINK);
      const linkHref = await link.getProperty("href");
      const linkUrl = await linkHref.jsonValue();

      return [nameText, linkUrl];
    })
  );
  SHOW_PROGRESS && process.stdout.write("\n");

  SHOW_PROGRESS && console.log(`[ ]      Got ${profiles.length} profiles`);

  const scrapedData = [];
  for (let i = 0; i < profiles.length; i++) {
    const [name, url] = profiles[i];
    !SHOW_PROGRESS && process.stdout.write(".");

    SHOW_PROGRESS && console.log(`[ ]         Getting "${name}" profile json`);
    await page.goto(`${url}/json`);

    const jsonNode = await page.$("pre");
    const jsonInnerText = await jsonNode.getProperty("innerText");
    const json = await jsonInnerText.jsonValue();

    const result = { name, url, json };

    if (WRITE_TO_CACHE) {
      const filename = CACHE_FULLPATH(name);

      SHOW_PROGRESS &&
        console.log(`[ ]            Writing to ${filename}`);
      await fs.outputFile(filename, JSON.stringify(result));
    }

    scrapedData.push(result);
  }

  SHOW_PROGRESS && console.log("[ ]      Closing Browser");
  await browser.close();

  return scrapedData;
}

async function auth({ browser, page }, options) {
  const {
    SHOW_PROGRESS,
    puppeteer: { AUTHENTICATE_TIMEOUT }
  } = options;

  // Give the user time to Authenticate
  SHOW_PROGRESS &&
    console.log(
      `[ ]      Waiting up to ${AUTHENTICATE_TIMEOUT /
        1000}seconds for user to authenticate. Kill window with CTRL-C if it doesn't close automatically when you close Chrome`
    );

  await promiseAny([
    new Promise(x => page.on("close", x)), // User closed tab, fires close event
    page.waitFor(AUTHENTICATE_TIMEOUT) // Timeout
  ]);

  await browser.close();
}

async function captcha(
  { page: originalPage, browser: originalBrowser },
  options
) {
  const {
    SHOW_PROGRESS,
    puppeteer: {
      CHROME_EXECUTABLE_PATH,
      CHROME_DATA_DIR,
      CHROME_ENABLE_HEADLESS,
      WEB_URL,
      AUTHENTICATE_TIMEOUT
    }
  } = options;

  const pageTitle = await originalPage.title();

  if (pageTitle !== "Access to this page has been denied.") {
    return;
  }

  console.log(`[!]      CAPTCHA`);
  let browser = originalBrowser;

  if (CHROME_ENABLE_HEADLESS) {
    SHOW_PROGRESS && console.log(`[ ]      Closing headless browser`);
    await originalBrowser.close();

    browser = await puppeteer.launch({
      devtools: false,
      headless: false,
      executablePath: CHROME_EXECUTABLE_PATH,
      userDataDir: CHROME_DATA_DIR,
      defaultViewport: null // Fullscreen
    });
  }

  // TODO: When Captcha -> Open a new page
  const page = await browser.newPage();

  console.log(`[ ]      Opening page in User Facing browser`);
  SHOW_PROGRESS && console.log(`[ ]      Navigating to ${WEB_URL}`);
  await page.goto(WEB_URL, {
    waitUntil: "networkidle2",
    timeout: 0
  });

  await page.bringToFront();
  console.log(`[ ]      Please complete Captcha, then close browser`);
  await promiseAny([
    new Promise(x => page.on("close", x)), // User closed tab, fires close event
    page.waitFor(AUTHENTICATE_TIMEOUT) // Timeout
  ]);

  await browser.close();
  return true;
}

module.exports = main;
