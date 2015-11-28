"use strict";

var expect = require("chai").expect;
var downloader = require("../lib/downloader");

describe("downloader", function() {

  describe("Attempting to download with wrong parameters", function() {

    it("should fail when passing incorrect url", function(done) {

      var url = "";
      var saveAtPath = __dirname + "/file.png";

      // Try loading the incorrect badge
      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("You need to provide the URL and the location to save the file!");

        done();
      });
    });

    it("should fail when passing incorrect saveAtPath", function(done) {

      var url = "https://google.com";
      var saveAtPath = "";

      // Try loading the incorrect badge
      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("You need to provide the URL and the location to save the file!");

        done();
      });
    });

    it("should fail when passing incorrect url type", function(done) {

      var url = function() {};
      var saveAtPath = __dirname;

      // Try loading the incorrect badge
      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The parameter 'url' must be a string");

        done();
      });
    });

    it("should fail when passing incorrect saveAtPath type", function(done) {

      var url = "https://google.com";
      var saveAtPath = function() {};

      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The parameter 'saveAtPath' must be a string");

        done();
      });

    });

    it("should fail when passing incorrect callback type", function(done) {

      var url = "https://google.com";
      var saveAtPath = "/tmp/file.jpg";
      var cb = "not-a-function";

      // http://stackoverflow.com/a/21587239/433814
      // Notice that the bind method will create a function for expect to call
      expect(downloader.bind(downloader, url, saveAtPath, cb)).to.throw("The callback provided must be a function");
      done();
    });
  });

  describe("Attempting to download with improper file path", function() {

    it("should fail when passing a saveAtPath that's a directory", function(done) {

      var url = "https://www.google.com/images/srpr/logo11w.png";
      // The current directory
      var saveAtPath = __dirname;

      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("Cannot save the url " + url + " as a directory " + saveAtPath);

        done();
      });

    });

    it("should fail when passing a saveAtPath that does not exist", function(done) {

      var url = "https://www.google.com/logo.png";
      // The current directory
      var saveAtPath = __dirname + "/not-existent/logo.png";

      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The path '" + saveAtPath.replace("/logo.png", "") + "' does NOT exist!");

        done();
      });

    });

  });

  describe("Attempting to download with incorrect URL", function() {

    it("should just fail", function(done) {

      var url = "https://www.google.com/images/srpr/NON-EXISTENT.png";
      // The current directory
      var saveAtPath = __dirname + "/logo.png";

      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The resource at the given URL " + url + " does NOT exist");

        done();
      });

    });

  });

  describe("Attempting to download with incorrect URL", function() {

    it("should just fail", function(done) {

      var url = "https://www.google.com/images/srpr/NON-EXISTENT.png";
      // The current directory
      var saveAtPath = __dirname + "/logo.png";

      downloader(url, saveAtPath, function downloadResults(err, status) {
        expect(err).to.be.an("Error");
        expect(status).to.be.undefined;
        expect(err.message).to.equal("The resource at the given URL " + url + " does NOT exist");

        done();
      });

    });

  });
});
