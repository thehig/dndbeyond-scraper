const fs = require("fs-extra");
const path = require("path");
const prettier = require("prettier");

const configuration = require("../development");

// The data that the Cache fn is writing is saving the stringified JSON
// To be able to process the data, this script should process each JSON file in the data folder, check for a 'json' prop, and if it finds one, parses it and writes it to a companion file after prettification

const jsonFilesIn = async cacheDir => {
  const filesInCacheDir = await fs.readdir(cacheDir);

  data = await Promise.all(
    filesInCacheDir // For each file in the dir
      .filter(f => f.toLocaleLowerCase().endsWith("json")) // That ends with JSON
      .map(async filename => {
        const contents = await fs.readJSON(path.join(cacheDir, filename)); // Read the JSON file
        return { filename, contents }; // And return it alongside its filename
      })
  );
  return data;
};

const main = async options => {
  const {
    output: { CACHE_DATA_DIR }
  } = options;

  // Get all the files in the cache dir
  const files = await jsonFilesIn(CACHE_DATA_DIR);
  await Promise.all([
    files // For each file in the dir
      .filter(f => f.filename.toLocaleLowerCase().endsWith("json")) // That ends with JSON
      .filter(f => !f.filename.toLocaleLowerCase().startsWith("_")) // Not previously parsed files
      .map(async ({ filename, contents: { name, url, json } }) => {
        // Rewrite the json (currently as string)
        console.log(`Writing _${filename}`);
        await fs.writeFile(
          // With a prepended underscore filename
          path.join(CACHE_DATA_DIR, `_${filename}`),
          prettier.format(json, {
            parser: "json"
          }) // After prettification
        );
      })
  ]);
};

main(configuration);
