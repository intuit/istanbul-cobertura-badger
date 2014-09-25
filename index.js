'use strict';

// For generating the coverage badge
var path = require('path');
var fs = require("fs");
var XMLSplitter = require('xml-splitter');
var request = require('request');

// Download function that downloads the image
var download = function(uri, filename, callback) {
  request.head(uri, function() {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var PLUGIN_NAME = "istanbul-cobertura-badger";

// plugin level function (dealing with files)
function gulpIstanbulBadger(coberturaFile, destinationDir, downloadCallback) {
  if (!coberturaFile) {
    throw new Error(PLUGIN_NAME, 'Missing cobertura file path text!');
  } else
  if (!destinationDir) {
    throw new Error(PLUGIN_NAME, 'Missing destination where to place the badge!');
  }

  var coberturaXmlReport = fs.readFileSync(coberturaFile);
  var xs = new XMLSplitter('/coverage');
  xs.on('data', function(data) {
    console.log(data);
    var overallPercentage = ((parseFloat(data["line-rate"]) + parseFloat(data["branch-rate"])) / 2) * 100;
    var color = overallPercentage >= 80 ? "brightgreen" : (overallPercentage >= 75 ? "yellow" : "red");
    var url = 'http://img.shields.io/badge/coverage-' + overallPercentage + '%-' + color + '.svg';
    var badgeFileName = path.join(destinationDir, "coverage.svg");

    console.log("Downloading coverage badge...");

    console.log("Here");
    download(url, badgeFileName, downloadCallback);

  }).parseString(coberturaXmlReport);
}

// exporting the plugin main function
module.exports = gulpIstanbulBadger;
