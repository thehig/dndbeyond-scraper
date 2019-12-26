const puppeteer = require("puppeteer");
const promiseAny = require("promise-any"); // TODO: Remove once Promise.any is a thing

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
      userDataDir: CHROME_DATA_DIR
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

module.exports = captcha;
