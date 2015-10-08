#!/usr/bin/env node
"use strict";

var path = require("path");
var coberturaBadger = require("./");

var program = require("commander");
var pkgJson = require("../package");

// Setting the defaults if the user uses istanbul
var input = path.resolve("./coverage/cobertura-coverage.xml");
var output = path.resolve("./coverage");
var defaultThresholds = require("./defaultThresholds");

program.description("Generates a badge for a given Cobertura XML report")
  .version(pkgJson.version)
  .option("-f, --defaults", "Use the default values for all the input.")
  .option("-e, --excellentThreashold <n>", "The threshold for green badges, where coverage >= -e", parseInt)
  .option("-g, --goodThreashold <n>", "The threshold for yellow badges, where -g <= coverage < -e  ", parseInt)
  .option("-b, --badgeFileName <badge>", "The badge file name that will be saved.")
  .option("-r, --reportFile <report>", "The istanbul cobertura XML file path.", input)
  .option("-d, --destinationDir <destination>", "The directory where 'coverage.svg' will be generated at.", output)
  .option("-v, --verbose", "Prints the metadata for the command")
  .parse(process.argv);

program.on("--help", function() {
  console.log("  Examples:");
  console.log("");
  console.log("    $ istanbul-cobertura-coverage -e 90 -g 65 -r coverage/cobertura.xml -d coverage/");
  console.log("      * Green: coverage >= 90");
  console.log("      * Yellow: 65 <= coverage < 90");
  console.log("      * Red: coverage < 65");
  console.log("      * Created at the coverage directory from the given report.");
  console.log("");
  console.log("    $ istanbul-cobertura-coverage -e 80 -d /tmp/build");
  console.log("      * Green: coverage >= 80");
  console.log("      * Yellow: 65 <= coverage < 80");
  console.log("      * Red: coverage < 65");
  console.log("");
});

// Stop the execution if no options were provided.
if (!program.defaults && !process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

// The options to the badger API coming from the program.
var opts = {
  badgeFileName: program.badgeFileName,
  destinationDir: path.resolve(program.destinationDir),
  istanbulReportFile: program.reportFile,
  thresholds: {
    // overall percent >= excellent, green badge
    excellent: program.excellentThreashold || defaultThresholds.excellent,
    // excellent < overall percent >= good, yellow badge
    good: program.goodThreashold || defaultThresholds.good
    // overall percent < good, red badge
  }
};

// Generate the badge.
coberturaBadger(opts, function(err, results) {
  if (err) {
    console.log(err);
    process.exit(-1);
  }

  if (program.verbose) {
    console.log(results);
  }

  // Output the message successful message.
  console.log("Badge created at " + results.badgeFile.filePath);
});
