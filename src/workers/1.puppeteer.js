const puppeteer = require("puppeteer");

// Open the browser, scrape the raw data into a JSON object
async function scrapeVideos({
  SHOW_PROGRESS,
  puppeteer: {
    CHROME_EXECUTABLE_PATH,
    CHROME_DATA_DIR,
    WEB_URL,
    // CSS_SELECTORS,

    TAKE_SCREENSHOT
  },
  output: { SCREENSHOT_FULLPATH }
}) {
  SHOW_PROGRESS && console.log(`[ ] Puppeteer`);
  SHOW_PROGRESS && console.log(`[ ]      Opening Browser`);
  const browser = await puppeteer.launch({
    devtools: true,
    headless: true,
    executablePath: CHROME_EXECUTABLE_PATH,
    userDataDir: CHROME_DATA_DIR
  });

  const page = await browser.newPage();

  SHOW_PROGRESS && console.log(`[ ]      Navigating to ${WEB_URL}`);
  await page.goto(WEB_URL, {
    waitUntil: "networkidle2",
    timeout: 0
  });

  await page.bringToFront();

  // CLICK EXAMPLE

  // SHOW_PROGRESS && console.log(`[ ]      Clicking ${CSS_SELECTOR_SHOW_ALL}`);
  // await page.click(CSS_SELECTOR_SHOW_ALL);

  // SCREENSHOT EXAMPLE

  // if (TAKE_SCREENSHOT) {
  //   SHOW_PROGRESS &&
  //     console.log(`[ ]      Screenshotting ${CSS_SELECTOR_VIDEO_GRID}`);
  //   const videoGrid = await page.$(CSS_SELECTOR_VIDEO_GRID);
  //   await videoGrid.screenshot({ path: SCREENSHOT_FULLPATH });
  //   SHOW_PROGRESS && console.log(`[ ]      Saved to ${SCREENSHOT_FULLPATH}`);
  // }

  // SCRAPE EXAMPLE
  // const videos = await page.$$(CSS_SELECTOR_VIDEO_WRAPPER);
  // SHOW_PROGRESS &&
  //   process.stdout.write(`[ ]      Scraping ${CSS_SELECTOR_VIDEO_WRAPPER} `);
  // const shows = await Promise.all(
  //   videos.map(async video => {
  //     SHOW_PROGRESS && process.stdout.write(".");
  //     const tile = await video.$(CSS_SELECTOR_VIDEO_TILE);
  //     const tileInnerText = await tile.getProperty("innerText");
  //     const tileText = await tileInnerText.jsonValue();

  //     const info = await video.$(CSS_SELECTOR_VIDEO_INFOBAR);
  //     const infoInnerText = await info.getProperty("innerText");
  //     const infoText = await infoInnerText.jsonValue();

  //     return [tileText, infoText];
  //   })
  // );
  // SHOW_PROGRESS && process.stdout.write("\n");

  SHOW_PROGRESS && console.log("[ ]      Closing Browser");
  await browser.close();

  // return shows;
}

module.exports = scrapeVideos;
