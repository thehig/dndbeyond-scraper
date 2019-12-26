const defaults = require("./defaults");

const mergedArgs = {
  SHOW_PROGRESS,
  puppeteer: {
    ...defaults.puppeteer,
    TAKE_SCREENSHOT: true
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
