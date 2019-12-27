const puppeteer = require("./workers/1.puppeteer");
const parser = require("./workers/2.parser");
const markdown = require("./workers/3.markdown");
const output = require("./workers/4.output");

async function main(options) {
  // SHOW_PROGRESS && //
  process.stdout.write("[ ] Running ");
  process.stdout.write(options.SHOW_PROGRESS ? "\n" : "."); // If we're showing progress, put in a newline so we don't fuck all the printing up
  const scraped = await puppeteer(options);
  if (scraped === "RESTART") {
    console.log("[ ] Please try again");
    // TODO: Automate the restart but override the AUTHENTICATE to prevent infinite loop
    return;
  }
  if (!options.SHOW_PROGRESS) process.stdout.write(".");
  const parsed = parser(scraped, options);
  // if (!options.SHOW_PROGRESS) process.stdout.write(".");
  // const markeddown = markdown(parsed, options);
  // if (!options.SHOW_PROGRESS) process.stdout.write(".\n");
  // output(markeddown, options);
  console.log("[ ] Complete");
}

module.exports = main;
