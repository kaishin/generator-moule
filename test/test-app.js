"use strict";

var path = require("path");
var assert = require("yeoman-generator").assert;
var helpers = require("yeoman-generator").test;
var os = require("os");

describe("moule:app", function () {
  before(function (done) {
    helpers.run(path.join(__dirname, "../app"))
      .inDir(path.join(os.tmpdir(), "./temp-test"))
      .withOptions({ "skip-install": true })
      .withPrompt({
        hasBlog: true
      })
      .on("end", done);
  });

  it("creates files", function () {
    assert.file([
      "bower.json",
      "package.json",
      "_config.yml",
      "source/_posts",
      ".scss-lint.yml"
    ]);
  });
});
