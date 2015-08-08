"use strict";

// For generating the coverage badge
var path = require("path");
var downloader = require("./downloader");
var reportParser = require("./istanbulReportParser");

// exporting the plugin main function
module.exports = gulpIstanbulBadger;

// plugin level function (dealing with files)
function gulpIstanbulBadger(istanbulReportFile, destinationDir, downloadCallback) {

  reportParser(istanbulReportFile, function(err, xml) {
    if (err) {
      return downloadCallback(err);
    }

    // Calculate the final percent based on the line and branch rates
    var overallPercentage = (((parseFloat(xml["line-rate"]) + parseFloat(xml["branch-rate"])) / 2) * 100).toFixed(0);

    // The color depends on the fixed thresholds (RED: 0 >= % < 60) (YELLOW: 60 >= % < 90) (GREEN: % >= 90)
    var color = overallPercentage >= 90 ? "brightgreen" : (overallPercentage >= 60 ? "yellow" : "red");

    // The shields service that will give badges.
    var url = "http://img.shields.io/badge/coverage-" + overallPercentage + "%-" + color + ".svg";

    // Save always as coverage image.
    var badgeFileName = path.join(destinationDir, "coverage.svg");

    downloader(url, badgeFileName, downloadCallback);

  });
}
