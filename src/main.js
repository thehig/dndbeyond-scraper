const puppeteer = require("./puppeteer");
const parser = require("./parser");
const markdown = require("./markdown");
const output = require("./output");

async function main(options) {
  // SHOW_PROGRESS && //
  process.stdout.write("[ ] Running ");
  process.stdout.write(options.SHOW_PROGRESS ? "\n" : "."); // If we're showing progress, put in a newline so we don't fuck all the printing up
  const scraped = await puppeteer(options);
  if (!options.SHOW_PROGRESS) process.stdout.write(".");
  const parsed = parser(scraped, options);
  if (!options.SHOW_PROGRESS) process.stdout.write(".");
  const markeddown = markdown(parsed, options);
  if (!options.SHOW_PROGRESS) process.stdout.write(".\n");
  output(markeddown, options);
  console.log("[ ] Complete");
}

module.exports = main;
