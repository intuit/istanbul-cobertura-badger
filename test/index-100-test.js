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

    it("should open the proper path, compute the overall coverage 100%", function(done) {

      // Use the fixture that's without problems
      var opts = {
        destinationDir: destinationDir,
        istanbulReportFile: path.resolve(__dirname, "fixture", "istanbul-report-100.xml")
      };

      // Load the badge for the report
      badger(opts, function parsingResults(err, badgeStatus) {
        expect(err).to.be.null;
        expect(badgeStatus).to.be.an("object");

        console.log(badgeStatus);
        expect(badgeStatus.overallPercent).to.equal(100);

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

  });
});
