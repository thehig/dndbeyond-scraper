#!/usr/bin/env node
const yargs = require("yargs");
const defaults = require("../src/defaults.js");
const main = require("../src/main.js");

/**
 * https://github.com/yargs/yargs/blob/aa09faf708457bf46eb9b003ce168302763a7d9e/docs/api.md
 *
 * alias: string or array of strings, alias(es) for the canonical option key, see alias()
 * array: boolean, interpret option as an array, see array()
 * boolean: boolean, interpret option as a boolean flag, see boolean()
 * choices: value or array of values, limit valid option arguments to a predefined set, see choices()
 * coerce: function, coerce or transform parsed command line values into another value, see coerce()
 * config: boolean, interpret option as a path to a JSON config file, see config()
 * configParser: function, provide a custom config parsing function, see config()
 * conflicts: string or array of strings, require certain keys not to be set, see conflicts()
 * count: boolean, interpret option as a count of boolean flags, see count()
 * default: value, set a default value for the option, see default()
 * defaultDescription: string, use this description for the default value in help content, see default()
 * demandOption: boolean or string, demand the option be given, with optional error message, see demandOption()
 * desc/describe/description: string, the option description for help content, see describe()
 * global: boolean, indicate that this key should not be reset when a command is invoked, see global()
 * group: string, when displaying usage instructions place the option under an alternative group heading, see group()
 * hidden: don't display option in help output.
 * implies: string or array of strings, require certain keys to be set, see implies()
 * nargs: number, specify how many arguments should be consumed for the option, see nargs()
 * normalize: boolean, apply path.normalize() to the option, see normalize()
 * number: boolean, interpret option as a number, number()
 * requiresArg: boolean, require the option be specified with a value, see requiresArg()
 * skipValidation: boolean, skips validation if the option is present, see skipValidation()
 * string: boolean, interpret option as a string, see string()
 * type: one of the following strings
 *        'array': synonymous for array: true, see array()
 *        'boolean': synonymous for boolean: true, see boolean()
 *        'count': synonymous for count: true, see count()
 *        'number': synonymous for number: true, see number()
 *        'string': synonymous for string: true, see string()
 */

const args = yargs
  .wrap(Math.min(180, yargs.terminalWidth()))

  .usage("Usage: $0 [options]")
  // .example(
  //   "$0 -nNoc",
  //   "show new season (n), ongoing season (o) and new Series (N) in the console (c)"
  // )
  .epilogue(
    "For more information check the github repository at https://github.com/thehig/dndbeyond-scraper"
  )
  .alias("v", "version")
  // Generic Options
  .option("help", {
    alias: ["h", "?"],
    describe: "Show this document",
    type: "boolean"
  })
  .option("show-hidden", {
    alias: "H",
    describe: "Show hidden options",
    type: "boolean"
  })
  .option("PRINT_CONFIG", {
    alias: "PC",
    describe: "Show configuration without starting",
    type: "boolean",
    default: false
  })
  .option("SHOW_PROGRESS", {
    alias: "l",
    describe: "Show progress information",
    type: "boolean",
    default: false
  })
  // Puppeteer Options
  .option("TAKE_SCREENSHOT", {
    alias: "s",
    group: "Puppeteer",
    describe: "Take a screenshot of the video grid",
    type: "boolean",
    default: defaults.puppeteer.TAKE_SCREENSHOT
  })
  .option("CHROME_EXECUTABLE_PATH", {
    group: "Puppeteer",
    describe: "Location of chrome executable",
    type: "string",
    hidden: true,
    default: defaults.puppeteer.CHROME_EXECUTABLE_PATH
  })
  .option("CHROME_DATA_DIR", {
    group: "Puppeteer",
    describe: "Location of chrome data directory",
    type: "string",
    hidden: true,
    default: defaults.puppeteer.CHROME_DATA_DIR
  })
  .option("SCREENSHOTS_DATA_DIR", {
    group: "Puppeteer",
    describe: "Location of screenshots data directory",
    type: "string",
    hidden: true,
    default: defaults.puppeteer.SCREENSHOTS_DATA_DIR
  })
  // Parser Options
  .option("VERBOSE_PARSING", {
    alias: "v",
    group: "Parser",
    describe: "Enable verbose logging for Parsing",
    type: "boolean",
    default: defaults.parser.VERBOSE_PARSING
  })
  // Markdown Options
  /* eg: 
  .option("FILTER_NEW_SEASON", {
    alias: "n",
    group: "Markdown",
    describe: "Include new seasons in output",
    type: "boolean",
    default: defaults.markdown.FILTER_NEW_SEASON
  }) */
  // Output Options
  .option("WRITE_TO_FILE", {
    alias: "w",
    group: "Output",
    describe: "Write to file",
    type: "boolean",
    default: defaults.output.WRITE_TO_FILE
  })
  .option("WRITE_TO_CONSOLE", {
    alias: "c",
    group: "Output",
    describe: "Write to console",
    type: "boolean",
    default: defaults.output.WRITE_TO_CONSOLE
  })
  .check(args => {
    // When PRINT_CONFIG is set we want to ignore the errors
    if (args.PRINT_CONFIG) return true;

    if (!args.WRITE_TO_FILE && !args.WRITE_TO_CONSOLE) {
      throw new Error(
        "At least one of [WRITE_TO_FILE, WRITE_TO_CONSOLE] must be true"
      );
    }

    return true;
  })
  .fail((msg, err, yargs) => {
    // if (err) throw err; // preserve stack
    console.error(yargs.help());
    console.error("\nError:", msg, "\n");
    process.exit(1);
  }).argv;

const {
  // Generic Options
  PRINT_CONFIG,
  SHOW_PROGRESS,
  // Puppeteer Options
  TAKE_SCREENSHOT,
  CHROME_EXECUTABLE_PATH,
  CHROME_DATA_DIR,
  SCREENSHOTS_DATA_DIR,
  // Parser Options
  VERBOSE_PARSING,
  // Markdown Options
  // ...
  // Output Options
  WRITE_TO_FILE,
  WRITE_TO_CONSOLE
} = args;

const mergedArgs = {
  SHOW_PROGRESS,
  puppeteer: {
    ...defaults.puppeteer,
    TAKE_SCREENSHOT,
    CHROME_EXECUTABLE_PATH,
    CHROME_DATA_DIR,
    SCREENSHOTS_DATA_DIR
  },
  parser: {
    ...defaults.parser,
    VERBOSE_PARSING
  },
  markdown: {
    ...defaults.markdown
    // ...
  },
  output: {
    ...defaults.output,
    WRITE_TO_FILE,
    WRITE_TO_CONSOLE
  }
};

if (PRINT_CONFIG) {
  console.log(JSON.stringify(mergedArgs, null, 4));
  process.exit(1);
}

main(mergedArgs);
