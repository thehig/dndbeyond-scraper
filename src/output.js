const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

async function writeToFile(
  text,
  {
    SHOW_PROGRESS,
    output: { MARKDOWN_FULLPATH, WRITE_TO_FILE, WRITE_TO_CONSOLE }
  }
) {
  SHOW_PROGRESS && console.log(`[ ] Output`);
  if (WRITE_TO_FILE) {
    SHOW_PROGRESS && console.log("[ ]      Writing to File", MARKDOWN_FULLPATH);
    await writeFile(MARKDOWN_FULLPATH, text);
    SHOW_PROGRESS && console.log("[ ]      Done Writing to File");
  }
  if (WRITE_TO_CONSOLE) {
    SHOW_PROGRESS && console.log("[ ]      Writing to Console");
    console.log(text);
    SHOW_PROGRESS && console.log("[ ]      Done Writing to Console");
  }
}

module.exports = writeToFile;
