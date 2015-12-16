"use strict";

var path = require("path");
var expect = require("chai").expect;
var fs = require("fs");

var badger = require("../lib");
var destinationDir = __dirname;

describe("istanbul-cobertura-badger", function() {

  describe("Parsing existing reports", function() {
    // As it will download a badge.
    this.timeout(10000);

    it("should open the proper path, compute the overall coverage percentage and create the badge", function(done) {

      // Use the fixture that's without problems
      var opts = {
        destinationDir: destinationDir,
        istanbulReportFile: path.resolve(__dirname, "fixture", "istanbul-report.xml")
      };

      // Load the badge for the report
      badger(opts, function parsingResults(err, badgeStatus) {
        expect(err).to.be.null;
        expect(badgeStatus).to.be.an("object");

        console.log(badgeStatus);

        var coverageBadgePath = path.normalize(path.resolve(destinationDir, "coverage.svg"));
        expect(coverageBadgePath.indexOf("coverage.svg")).to.be.above(0);

        // Verify that the badge file was successfully created
        fs.stat(coverageBadgePath, function gettingStats(err, stats) {
          expect(err).to.be.null;
          expect(stats).to.be.an("object");
          expect(stats.isFile()).to.be.true;
          expect(stats.size).to.be.above(0);

          fs.unlink(coverageBadgePath, function(err) {
            if (err) {
              console.log(err);
            }
            console.log("Deleted the badge file " + coverageBadgePath);

            done();
          });

        });

      });

    });

    it("should compute overall coverage over multiple packages and create the badge", function(done) {
      // Use the fixture that's without problems
      // Using defaults directory /coverage/
      var opts = {
        badgeFileName: "coverage-multiple",
        destinationDir: destinationDir,
        istanbulReportFile: path.resolve(__dirname, "fixture", "istanbul-report-multiple-packages.xml")
      };

      // Load the badge for the report
      badger(opts, function parsingResults(err, badgeStatus) {
        expect(err).to.be.null;
        expect(badgeStatus).to.be.an("object");

        console.log(badgeStatus);

        var fileWithExtension = opts.badgeFileName + ".svg";
        var coverageBadgePath = path.normalize(path.resolve(destinationDir, fileWithExtension));
        expect(coverageBadgePath.indexOf(fileWithExtension)).to.be.above(0);

        // Verify that the badge file was successfully created
        fs.stat(coverageBadgePath, function gettingStats(err, stats) {
          expect(err).to.be.null;
          expect(stats).to.be.an("object");
          expect(stats.isFile()).to.be.true;
          expect(stats.size).to.be.above(0);

          fs.unlink(coverageBadgePath, function(err) {
            if (err) {
              console.log(err);
            }
            console.log("Deleted the badge file " + coverageBadgePath);

            done();
          });

        });

      });
    });

  });

  describe("Parsing reports with xml problems", function() {

    it("should not parse and properly show the parsing error", function(done) {

      // Use the fixture that's without problems
      var opts = {
        destinationDir: destinationDir,
        istanbulReportFile: path.resolve(__dirname, "fixture", "istanbul-report-with-problem.xml")
      };

      // Try loading the incorrect badge
      badger(opts, function parsingResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;

        done();
      });
    });

  });
});
