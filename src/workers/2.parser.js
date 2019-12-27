const fs = require("fs-extra");

// Turn the scraped data into parsed, usable information
async function main(data, options) {
  const {
    SHOW_PROGRESS,
    parser: { VERBOSE_PARSING }
  } = options;

  SHOW_PROGRESS && process.stdout.write("\n");
  SHOW_PROGRESS && console.log(`[ ] Parser`);

  SHOW_PROGRESS && console.log(`[ ]     Writing to file: ${MARKDOWN_FULLPATH}`);

  await fs.writeJson(MARKDOWN_FULLPATH, data);

  SHOW_PROGRESS && console.log(`[ ]     Successful`);
  // Parse Data
  return;
}

module.exports = main;
