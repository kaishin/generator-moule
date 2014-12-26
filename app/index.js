"use strict";
var yeoman = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var shelljs = require("shelljs");
var path = require("path");

module.exports = yeoman.generators.Base.extend({
  init: function() {
    var dependenciesInstalled = ["bundle", "ruby"].every(function (depend) {
      return shelljs.which(depend);
    });

    if (!dependenciesInstalled) {
      this.log("MISSING DEPENDENCIES:" +
        "\nEither " + chalk.white("Ruby") + " or " + chalk.white("Bundler") + " is not installed or missing from $PATH." +
        "\nMake sure that they are either installed or added to $PATH.");
      shelljs.exit(1);
    };
  },

  initializing: function () {
    this.pkg = require("../package.json");
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      "Welcome to the terrific" + chalk.red("Moule") + " generator!"
    ));

    var prompts = [{
      name: "authorName",
      message: "Author name:"
    }, {
      name: "projectName",
      message: "Project name:"
    }, {
      name: "projectDescription",
      message: "Project description:",
      default: ""
    }, {
      name: "projectTagline",
      message: "Project tagline:"
    }, {
      name: "projectUrl",
      message: "Project production URL:"
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectDescription = props.projectDescription;
      this.projectTagline = props.projectTagline;
      this.projectUrl = props.projectUrl;
      this.authorName = props.authorName;

      done();
    }.bind(this));
  },

  scaffolding: function () {
    this.copy("Gemfile", "Gemfile");
    this.copy("bowerrc", ".bowerrc");
    this.copy("_bower.json", "bower.json");
    this.template("_package.json", "package.json");
    this.template("_config.yml", "_config.yml");
    this.template("_config.build.yml", "_config.build.yml");
    this.template("_README.md", "README.md");
    this.copy("gulpfile.js", "gulpfile.js");
    this.copy("gulpfile.coffee", "gulpfile.coffee");
    this.copy("gitignore", ".gitignore");
    this.copy("gitattributes", ".gitattributes");
    this.copy("editorconfig", ".editorconfig");
    this.directory("app", "source");
  },

  install: function () {
    this.spawnCommand("bundle", ["install"]);
    this.installDependencies({
      skipInstall: this.options["skip-install"]
    });
  }
});
