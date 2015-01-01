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

    this.log("This is " + chalk.blue("Moule") + ", a Web site generator. Tell us about your project, will ya?");

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
    }, {
      name: "hasBlog",
      type: "confirm",
      message: "Enable blog support?",
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectDescription = props.projectDescription;
      this.projectTagline = props.projectTagline;
      this.projectUrl = props.projectUrl;
      this.authorName = props.authorName;
      this.hasBlog = props.hasBlog;

      done();
    }.bind(this));
  },

  scaffolding: function () {
    this.copy("Gemfile");
    this.copy("bowerrc", ".bowerrc");
    this.template("_package.json", "package.json");
    this.template("_bower.json", "bower.json");
    this.template("_config.yml");
    this.template("_config.serve.yml");
    this.template("_README.md", "README.md");
    this.copy("gulp.js");
    this.copy("gulpfile.coffee");
    this.copy("gitignore", ".gitignore");
    this.copy("editorconfig", ".editorconfig");
    this.directory("source/_coffee");
    this.directory("source/_layouts");
    this.copy("source/_layouts/page.html");
    this.copy("source/_layouts/default.html");
    this.directory("source/_includes");
    this.directory("source/_scss");
    this.directory("source/css");
    this.directory("source/scripts");
    this.copy("source/index.md");

    if (this.hasBlog) {
      this.directory("source/_posts");
      this.copy("source/feed.xml");
      this.copy("source/_layouts/post.html");
    }
  },

  install: function () {
    var skipInstall = this.options["skip-install"];

    if (!skipInstall) {
      console.log("Installing dependencies...")
      this.spawnCommand("bundle", ["install", "--quiet"]);
      this.installDependencies();
    }
  }
});
