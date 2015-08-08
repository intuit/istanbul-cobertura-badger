#!/bin/sh
":"; //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

"use strict";

var path = require("path");
var coberturaBadger = require("./");

// Setting the defaults if the user uses istanbul
var input = "./coverage/cobertura-coverage.xml";
var output = "./coverage";

// Overriding defaults
if (process.argv.length > 2) {
  input = process.argv[2];
}
if (process.argv.length > 3) {
  output = process.argv[3];
}

// Fail if more arguments are provided.
if (process.argv.length > 4) {
  console.error("usage: istanbul-cobertura-badger [path/to/cobertura-coverage.xml] [outdir]");
  process.exit(1);
}

// Generate the badge.
var destinationPath = path.resolve(output);
coberturaBadger(input, destinationPath, function(err) {
  if (err) {
    console.log(err);
    process.exit(-1);
  }

  // Output the message successful message.
  console.log("Badge created at " + destinationPath + "/coverage.svg");
});
