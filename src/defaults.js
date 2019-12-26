const path = require("path");
let now = new Date();
const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}-${now.getMinutes()}`; // prettier-ignore

const MARKDOWN_DATA_DIR = path.resolve(__dirname, "../data");
const MARKDOWN_FILENAME = `dndbeyond-${date}.md`;

const SCREENSHOT_DATA_DIR = path.resolve(__dirname, "../screenshots");
const SCREENSHOT_FILENAME = `dndbeyond-${date}.png`;

const options = {
  SHOW_PROGRESS: false,
  puppeteer: {
    TAKE_SCREENSHOT: false,

    WEB_URL: "https://followshows.com/",
    CHROME_EXECUTABLE_PATH: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", // prettier-ignore
    CHROME_DATA_DIR: path.resolve(__dirname, "../chromedata"),

    CHROME_ENABLE_DEVTOOLS: false,
    CHROME_ENABLE_HEADLESS: true

    // CSS Selectors
    // eg: CSS_SELECTOR_VIDEO_GRID: ".videos-grid-container",
  },
  parser: {
    VERBOSE_PARSING: false
  },
  markdown: {
    // Markdown Options
    // eg: NEW_SEASON_REGEX: /^s\d*e0?1$/
  },
  output: {
    WRITE_TO_FILE: false,
    WRITE_TO_CONSOLE: true,
    MARKDOWN_DATA_DIR,
    MARKDOWN_FILENAME,
    MARKDOWN_FULLPATH: path.join( MARKDOWN_DATA_DIR, MARKDOWN_FILENAME ), // prettier-ignore

    SCREENSHOT_DATA_DIR,
    SCREENSHOT_FILENAME,
    SCREENSHOT_FULLPATH: path.join( SCREENSHOT_DATA_DIR, SCREENSHOT_FILENAME ) // prettier-ignore
  }
};

module.exports = options;
