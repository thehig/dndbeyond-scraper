const defaults = require("./defaults");

const mergedArgs = {
  SHOW_PROGRESS: true,

  WRITE_TO_CACHE: false,
  READ_FROM_CACHE: true,

  puppeteer: {
    ...defaults.puppeteer
    // CHROME_ENABLE_DEVTOOLS: true,
    // CHROME_ENABLE_HEADLESS: false,
    // TAKE_SCREENSHOT: true
    // AUTHENTICATE: true,
  },
  parser: {
    ...defaults.parser,
    VERBOSE_PARSING: true
    // MAX_DATA_ROWS: 1
  },
  markdown: {
    ...defaults.markdown
    // ...
  },
  output: {
    ...defaults.output,
    WRITE_TO_FILE: false,
    WRITE_TO_CONSOLE: true
  }
};

module.exports = mergedArgs;
