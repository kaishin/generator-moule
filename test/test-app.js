"use strict";

var path = require("path");
var assert = require("yeoman-assert");
var test = require("yeoman-test");
var os = require("os");

describe("moule:app", function () {
  before(function (done) {
    test.run(path.join(__dirname, "../app"))
      .withOptions({ "skip-install": true })
      .withArguments([])
      .withPrompts({
        hasBlog: true,
        ghPages: true
      })
      .on("end", done);
  });

  it("creates files", function () {
    assert.file([
      "bower.json",
      "package.json",
      "_config.yml",
      "_posts",
      ".scss-lint.yml"
    ]);
  });
});
