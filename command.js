#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var path = require('path');
var coberturaBadger = require('./');

var input = "./coverage/cobertura-coverage.xml";
var output = "./coverage";

if(process.argv.length > 2) {input = process.argv[2];}
if(process.argv.length > 3) {input = process.argv[3];}
if(process.argv.length > 4) {
    console.error("usage: istanbul-cobertura-badger [path/to/cobertura-coverage.xml] [outdir]");
    process.exit(1);
}

var destinationPath = path.resolve(output);
coberturaBadger(input, destinationPath, function() {
  console.log("Badge created at " + destinationPath + "/coverage.svg");
});