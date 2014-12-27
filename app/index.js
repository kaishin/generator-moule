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

    this.log("This is " + chalk.red("Moule") + ", a Web site generator. Tell us about your project, will ya?");

    var prompts = [{
      name: "authorName",
      message: "Author name:"
    }, {
      name: "projectName",
      message: "Project name:",
      default: "My awesome site"
    }, {
      name: "projectDescription",
      message: "Project description:",
      default: "My awesome description"
    }, {
      name: "projectTagline",
      message: "Project tagline:",
      default: "My awesome tagline"
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
    this.template("_package.json", "package.json");
    this.template("_config.yml", "_config.yml");
    this.template("_config.build.yml", "_config.build.yml");
    this.template("_README.md", "README.md");
    this.copy("gulp.js", "gulp.js");
    this.copy("gulpfile.coffee", "gulpfile.coffee");
    this.copy("gitignore", ".gitignore");
    this.copy("editorconfig", ".editorconfig");
    this.directory("source", "source");
  },

  install: function () {
    this.spawnCommand("bundle", ["install"]);
    this.installDependencies({
      skipInstall: this.options["skip-install"]
    });
  }
});
