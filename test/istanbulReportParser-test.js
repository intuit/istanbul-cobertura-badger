"use strict";

var expect = require("chai").expect;
var parser = require("../lib/istanbulReportParser");

describe("Coverage Parser", function() {

  describe("Attempting to parse with wrong parameters", function() {

    it("should fail when not providing the parameter 'reportFilePath'.", function(done) {
      var reportFilePath = "";

      // Try loading the incorrect badge
      parser(reportFilePath, function parseResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The istanbul report file path must be provided!");

        done();
      });
    });

    it("should fail when providing a non-existent report file.", function(done) {

      var reportFilePath = __dirname + "/coverage-non-existent.xml";

      // Try loading the incorrect badge
      parser(reportFilePath, function parseResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The istanbul report file '" + reportFilePath + "' does not exist!");

        done();
      });
    });

  });
});
