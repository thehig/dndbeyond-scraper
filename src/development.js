const defaults = require("./defaults");

const mergedArgs = {
  SHOW_PROGRESS: true,

  WRITE_TO_CACHE: true,
  READ_FROM_CACHE: false,

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
