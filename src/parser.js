// Turn the scraped data into parsed, usable information
const parseVideoInformation = (
  data,
  { SHOW_PROGRESS, parser: { VERBOSE_PARSING } }
) => {
  SHOW_PROGRESS && process.stdout.write("\n");
  // Parse Data
  return data;
};

module.exports = parseVideoInformation;
