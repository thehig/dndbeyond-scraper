const fs = require("fs-extra");
const path = require("path");

// Turn the scraped data into parsed, usable information
async function main(data, options) {
  const {
    SHOW_PROGRESS,
    READ_FROM_CACHE,
    parser: { VERBOSE_PARSING },
    output: { CACHE_DATA_DIR }
  } = options;

  SHOW_PROGRESS && process.stdout.write("\n");
  SHOW_PROGRESS && console.log(`[ ] Parser`);

  let parsedData = data;
  if (READ_FROM_CACHE) {
    SHOW_PROGRESS &&
      console.log(`[ ]      READ_FROM_CACHE Ignoring passed data parameter.`);
    const cacheFiles = await fs.readdir(CACHE_DATA_DIR);

    parsedData = await Promise.all(
      cacheFiles
        .filter(f => f.toLocaleLowerCase().endsWith("json"))
        .map(
          async filename =>
            await fs.readJSON(path.join(CACHE_DATA_DIR, filename))
        )
    );
  } // READ_FROM_CACHE

  console.log("parsedData", Object.keys(parsedData));
}

module.exports = main;
