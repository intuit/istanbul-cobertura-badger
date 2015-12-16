"use strict";

var fs = require("fs");
var XMLSplitter = require("xml-splitter");
var coberturaParser = require("./coberturaReportParser");

module.exports = parseIstanbulReport;

/**
 * Parses a given istanbul report file path and returns the XML "coverage" element containing the report results.
 *
 * @param {String} reportFilePath The location where the istanbul report in cobertura xml format is located.
 * @param {Function} callback Th regular CPS function.
 */
function parseIstanbulReport(reportFilePath, callback) {
  if (!reportFilePath) {
    return callback(new Error("The istanbul report file path must be provided!"));
  }

  // Read the XML cobertura report
  fs.readFile(reportFilePath, function(err, coberturaXmlReport) {
    if (err && err.code === "ENOENT") {
      return callback(new Error("The istanbul report file '" + reportFilePath + "' does not exist!"));

    } else if (err) {
      return callback(new Error("Error while reading the istanbul file '" + reportFilePath + "': " + err.message));
    }

    // Parse the cobertura root element.
    var xs = new XMLSplitter("/coverage");
    var errorOnce = false;

    // Calculate the final percent based on the line and branch rates
    xs.on("data", function parsingCoverageTag(xml) {

      // Calculate the function rate based on the functions collected.
      var methods = {
        total: 0,
        passed: 0
      };

      // Parse the xml in regards to the methods above.
      coberturaParser(xml, methods);

      // All the rates for the final result.
      var functionRate = parseFloat(methods.passed / methods.total);
      var lineRate = parseFloat(xml["line-rate"]);
      var branchRate = parseFloat(xml["branch-rate"]);

      // Calculate the final percent based on the line and branch rates$
      var percent = Math.floor(((functionRate + lineRate + branchRate) / 3) * 100);

      return callback(null, {
        overallPercent: percent,
        functionRate: functionRate,
        lineRate: lineRate,
        branchRate: branchRate
      });

    }).on("error", function handlingError(error) {
      var parsingError = new Error("Error parsing the given istanbul report (" + reportFilePath + "): ");
      parsingError.stack = error.stack;
      if (!errorOnce) {
        errorOnce = true;
        return callback(parsingError);
      }

    }).parseString(coberturaXmlReport);

  });
}
