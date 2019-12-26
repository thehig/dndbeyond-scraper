const prettier = require("prettier");

const toTitleCase = input =>
  input
    // insert a space before all caps
    .replace(/([A-Z])/g, " $1")
    // uppercase the first character
    .replace(/^./, str => str.toUpperCase());

// Convert a JSON object array into a markdown table (assuming they all have the same keys) and format using prettier
const createMarkdownTable = (dataArray, name) => {
  // Use the first item in the array to determine the keys
  const keys = Object.keys(dataArray[0]);

  const result = [
    `# ${name}\n`, // Table Name
    `| ${keys.map(toTitleCase).join(" | ")} |`, // Table Header
    `| ${" :---: |".repeat(keys.length)}`, // Table Alignment Indicators
    dataArray
      .sort((a, b) => a.numEpisodes - b.numEpisodes)
      .map(obj => {
        return `| ${keys.map(key => obj[key]).join(" | ")} |`;
      }) // Table Row
      .join("\n")
  ].join("\n");

  return result;
};

const createMarkdown = (
  data,
  {
    SHOW_PROGRESS,
    markdown: {
      // options
    }
  }
) => {
  SHOW_PROGRESS && console.log(`[ ] Markdown`);
  const tables = [];

  // Generate table data
  const markdownText = prettier.format(tables.join("\n\n"), {
    parser: "markdown"
  });

  return markdownText;
};

module.exports = createMarkdown;
