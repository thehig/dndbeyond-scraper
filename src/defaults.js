const path = require("path");
const sanitize = require("sanitize-filename");

const date = () => {
  let now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}`; // prettier-ignore
};

const MARKDOWN_DATA_DIR = path.resolve(__dirname, "../data");
const MARKDOWN_FILENAME = () => `dndbeyond-${date()}.md`;

const SCREENSHOT_DATA_DIR = path.resolve(__dirname, "../screenshots");
const SCREENSHOT_FILENAME = () => `dndbeyond-${date()}.png`;

const CACHE_DATA_DIR = path.resolve(__dirname, "../data");
const CACHE_FILENAME = name => `${sanitize(name)}.json`;

const options = {
  SHOW_PROGRESS: false,

  WRITE_TO_CACHE: false,
  READ_FROM_CACHE: false,

  puppeteer: {
    TAKE_SCREENSHOT: false,

    WEB_URL: "https://www.dndbeyond.com/my-campaigns",
    CHROME_EXECUTABLE_PATH: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", // prettier-ignore
    CHROME_DATA_DIR: path.resolve(__dirname, "../chromedata"),

    CHROME_ENABLE_DEVTOOLS: false,
    CHROME_ENABLE_HEADLESS: true,

    AUTHENTICATE: false,
    AUTHENTICATE_TIMEOUT: 10 * 60 * 1000, // ms

    // CSS Selectors
    CSS_SELECTOR_CAMPAIGN_LIST: ".RPGCampaign-listing",
    CSS_SELECTOR_CAMPAIGN_LINK: ".ddb-campaigns-list-item-footer-buttons-item",
    CSS_SELECTOR_PROFILE_CARD: ".ddb-campaigns-character-card-wrapper",
    CSS_SELECTOR_PROFILE_LINK:
      ".ddb-campaigns-character-card-footer-links-item-view",
    CSS_SELECTOR_PROFILE_NAME:
      ".ddb-campaigns-character-card-header-upper-character-info-primary"
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
    MARKDOWN_FULLPATH: () => path.join( MARKDOWN_DATA_DIR, MARKDOWN_FILENAME() ), // prettier-ignore

    SCREENSHOT_DATA_DIR,
    SCREENSHOT_FILENAME,
    SCREENSHOT_FULLPATH: () => path.join( SCREENSHOT_DATA_DIR, SCREENSHOT_FILENAME() ), // prettier-ignore

    CACHE_DATA_DIR,
    CACHE_FILENAME,
    CACHE_FULLPATH: name => path.join( CACHE_DATA_DIR, CACHE_FILENAME(name) ) // prettier-ignore
  }
};

module.exports = options;
