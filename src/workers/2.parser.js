// Turn the scraped data into parsed, usable information
const parseVideoInformation = (
  data,
  { SHOW_PROGRESS, parser: { VERBOSE_PARSING } }
) => {
  SHOW_PROGRESS && process.stdout.write("\n");
  SHOW_PROGRESS && console.log(`[ ] Parser TBD`);

  // Parse Data
  return;
};

module.exports = parseVideoInformation;
