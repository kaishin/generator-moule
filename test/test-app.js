path = require("path");
assert = require("yeoman-assert");
test = require("yeoman-test");
os = require("os");

describe("moule:app", function () {
  before(function (done) {
    test.run(path.join(__dirname, "../app"))
      .withOptions({ "skip-install": true })
      .withArguments([])
      .withPrompts({
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
