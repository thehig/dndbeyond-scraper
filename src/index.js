const main = require("./main");
const options = require("./development");

main(options)
  .then(() => {
    // Sometimes process doesn't properly close, this should force it to
    process.exit(0);
  })
  .catch(err => {
    console.log("!!!!!    Caught Error    !!!!!");
    console.log(err);
  });
