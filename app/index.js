yeoman = require("yeoman-generator")
chalk = require("chalk")
yosay = require("yosay")
shelljs = require("shelljs")
path = require("path")
_ = require("lodash")

module.exports = yeoman.generators.Base.extend({
  init: function() {
    dependenciesInstalled = ["bundle", "ruby"].every(function (depend) {
      return shelljs.which(depend)
    })

    if (!dependenciesInstalled) {
      this.log("MISSING DEPENDENCIES:" +
        "\nEither " + chalk.white("Ruby") + " or " + chalk.white("Bundler") + " is not installed or missing from $PATH." +
        "\nMake sure that they are either installed or added to $PATH.")
      shelljs.exit(1)
    }
  },

  initializing: function () {
    this.pkg = require("../package.json")
  },

  prompting: function () {
    done = this.async()

    this.log("This is " + chalk.blue("Moule") + ", a Web site generator. Tell us about your project, will ya?")

    prompts = [{
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
      name: "projectKeywords",
      message: "Project keywords (comma+space separated):",
      default: ""
    }, {
      name: "projectUrl",
      message: "Project production URL:",
      default: "http://example.com"
    }, {
      name: "hasBlog",
      type: "confirm",
      message: "Enable blog support?",
      default: true
     }]

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName
      this.projectSlug = _.kebabCase(props.projectName)
      this.projectDescription = props.projectDescription
      this.projectTagline = props.projectTagline
      this.projectKeywords = props.projectKeywords
      this.projectUrl = props.projectUrl
      this.authorName = props.authorName
      this.hasBlog = props.hasBlog

      done()
    }.bind(this))
  },

  scaffolding: function () {
    var sourceFolder = "./source/"
    this.copy("bowerrc", ".bowerrc")
    this.copy("Gemfile")
    this.copy("gitignore", ".gitignore")
    this.copy("gulpfile.js")
    this.copy("source/_layouts/default.html", sourceFolder + "_layouts/default.html")
    this.copy("source/_layouts/page.html", sourceFolder + "_layouts/page.html")
    this.copy("source/index.md", sourceFolder + "index.md")
    this.copy("source/robots.txt", sourceFolder + "robots.txt")
    this.directory("source/_coffee", sourceFolder + "_coffee")
    this.directory("source/_includes", sourceFolder + "_includes")
    this.directory("source/_layouts", sourceFolder + "_layouts")
    this.directory("source/_scss", sourceFolder + "_scss")
    this.directory("source/css", sourceFolder + "css")
    this.directory("source/images", sourceFolder + "images")
    this.directory("source/scripts", sourceFolder + "scripts")
    this.template("_config.serve.yml")
    this.template("_config.yml")
    this.template("_package.json", "package.json")
    this.template("bower.json")
    this.template("README.md")
    this.template("scss-lint.yml", ".scss-lint.yml")

    if (this.hasBlog) {
      this.directory("source/_posts", sourceFolder + "_posts")
      this.copy("source/feed.xml", sourceFolder + "feed.xml")
      this.copy("source/_layouts/post.html", sourceFolder + "_layouts/post.html")
    }
  },

  install: function () {
    skipInstall = this.options["skip-install"]

    if (!skipInstall) {
      console.log("Installing dependencies...")
      this.spawnCommand("bundle", ["install", "--quiet"])
      this.installDependencies()
    }
  }
})
