"use strict";

var http = require("http-request");
var path = require("path");
var fs = require("fs");

module.exports = downloader;

/**
 * Downloads a given URL as a file at the saveAtPath location.
 *
 * @param {String} url The URL to a file to be downloaded.
 * @param {String} saveAtPath An existing file path to save the file.
 * @param {Function} callback CPS callback with the error/result.
 */
function downloader(url, saveAtPath, callback) {
  // Handle the parameter errors
  if (!url || !saveAtPath) {
    return callback(new Error("You need to provide the URL and the location to save the file!"));
  }
  if (url && typeof url !== "string") {
    return callback(new Error("The parameter 'url' must be a string"));
  }
  if (saveAtPath && typeof saveAtPath !== "string") {
    return callback(new Error("The parameter 'saveAtPath' must be a string"));
  }
  if (callback && typeof callback !== "function") {
    throw new Error("The callback provided must be a function");
  }

  // The directory to save the file.
  var dirToSave = path.dirname(saveAtPath);

  // Verify if the directory to save exists before downloading.
  fs.stat(dirToSave, function gettingStats(err) {
    if (err) {
      return callback(new Error("The path '" + dirToSave + "' does NOT exist!"));
    }

    // Download if the directory to save exists.
    var options = {url: url};
    http.get(options, saveAtPath, function processingRequest(error, result) {
      if (error) {
        if (error.code === "ENOTFOUND") {
          return callback(new Error("There's no internet connectivity to " + url));

        } else if (error.code === "EISDIR") {
          return callback(new Error("Cannot save the url " + url + " as a directory " + saveAtPath));

        } else if (error.code === 404) {
          return callback(new Error("The resource at the given URL " + url + " does NOT exist"));

        } else {
          var unknownError = new Error("Unknown error to save " + url + " as " + saveAtPath);
          unknownError.stack = error.stack;
          return callback(unknownError);
        }
      }

      // Creating the response object.
      var response = {
        downloaded: true,
        filePath: result.file,
        size: result.stream._offset
      };

      // The request to the URL was successful and the file was saved.
      callback(null, response);
    });

  });
}
