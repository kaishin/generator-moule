browserSync = require "browser-sync"
cache = require "gulp-cached"
coffee = require "gulp-coffee"
del = require "del"
gulp = require "gulp"
gutil = require "gulp-util"
include = require "gulp-include"
mediaQueries = require "gulp-combine-media-queries"
minifyCSS = require "gulp-minify-css"
minifyJS = require "gulp-uglify"
prefix = require "gulp-autoprefixer"
runSequence = require "run-sequence"
sass = require "gulp-sass"
scssLint = require "gulp-scss-lint"
shell = require "gulp-shell"

<% if (hasBlog) { %>argv = require("yargs").argv
dateFormat = require "dateformat"
rename = require "gulp-rename"
replace = require "gulp-replace"
slugify = require "underscore.string/slugify"
now = new Date()
title = argv.t ? "Untitled"
dashedTitle = slugify(title)<% } %>
messages =
  jekyllBuild: "Rebuilding Jekyll..."

sourceFolder = <% if (!ghPages) { %>"./source"<% } else { %>"."<% } %>
destinationFolder = "./_site"

paths =
  sass: "#{sourceFolder}/_scss/"
  coffee: "#{sourceFolder}/_coffee/"
  styles: "#{sourceFolder}/css/"
  destinationStyles: "#{destinationFolder}/css/"
  scripts: "#{sourceFolder}/scripts/"
  destinationScripts: "#{destinationFolder}/scripts/"
  jekyllFiles: [
    "#{sourceFolder}/**/*.html",
    "#{sourceFolder}/**/*.md",
    "#{sourceFolder}/**/*.yml",
    "#{sourceFolder}/**/*.xml",
    "!#{sourceFolder}/node_modules/**/*",
    "!#{destinationFolder}/**/*"
  ]

gulp.task "default", ["develop"]

gulp.task "develop", ->
  runSequence ["watch", "browser-sync"]

gulp.task "build", ->
  runSequence ["sass", "coffee", "vendorJS"], "lintSass", "jekyll-build"

gulp.task "clean",
  del.bind(null, ["_site"])

gulp.task "watch", ["sass", "coffee", "jekyll-serve"], ->
  gulp.watch "#{paths.sass}/**/*.scss", ["sass"]
  gulp.watch "#{paths.coffee}/**/*.coffee", ["coffee"]
  gulp.watch "#{paths.coffee}/vendor.js", ["vendorJS"]
  gulp.watch paths.jekyllFiles, ["jekyll-rebuild"]

gulp.task "jekyll-serve",
  shell.task "bundle exec jekyll build --config _config.yml,_config.serve.yml", quiet: true
  browserSync.notify messages.jekyllBuild

gulp.task "jekyll-build",
  shell.task "bundle exec jekyll build"

gulp.task "jekyll-rebuild", ["jekyll-serve"], ->
  browserSync.reload()

gulp.task "doctor",
  shell.task "jekyll doctor"

gulp.task "sass", ->
  gulp.src("#{paths.sass}/*.scss")
    .pipe sass
      errLogToConsole: true
      precision: 2
    .pipe prefix ["last 2 versions", "> 2%", "ie 11", "Firefox ESR"], cascade: false
    .pipe mediaQueries()
    .pipe cache paths.styles
    .pipe minifyCSS()
    .pipe gulp.dest(paths.destinationStyles)
    .pipe gulp.dest(paths.styles)
    .pipe browserSync.reload(stream: true)

gulp.task "lintSass", ->
  gulp.src("#{paths.sass}/*.scss")
    .pipe cache paths.sass
    .pipe scssLint
      "config": ".scss-lint.yml",
      "bundleExec": true
    .pipe scssLint.failReporter()
    .on "error", (error) -> gutil.log(error.message)

gulp.task "coffee", ->
  gulp.src("#{paths.coffee}/*.coffee")
    .pipe cache paths.coffee
    .pipe coffee bare: true
    .on "error", (error) -> gutil.log(error.message)
    .pipe cache paths.scripts
    .pipe minifyJS()
    .pipe gulp.dest(paths.destinationScripts)
    .pipe gulp.dest(paths.scripts)
    .pipe browserSync.reload(stream: true)

gulp.task "vendorJS", ->
  gulp.src("#{paths.coffee}/vendor.js")
    .pipe include()
    .on "error", (error) -> gutil.log(error.message)
    .pipe cache paths.scripts
    .pipe minifyJS()
    .pipe gulp.dest(paths.destinationScripts)
    .pipe gulp.dest(paths.scripts)
    .pipe browserSync.reload(stream: true)

gulp.task "browser-sync", ->
  browserSync.init null,
    server:
      baseDir: destinationFolder
    host: "localhost"
    port: 4000
    open: true
    browser: "chrome"

<% if (hasBlog) { %> gulp.task "post", ->
  gulp.src("./_posts/_template.md")
    .pipe rename "#{dateFormat(now, 'yyyy-mm-dd')}-#{dashedTitle}.md"
    .pipe replace(/DATE_PLACEHOLDER/g, "#{dateFormat(now, 'yyyy-mm-dd hh:MM:ss o')}")
    .pipe replace(/TITLE_PLACEHOLDER/g, dashedTitle)
    .pipe gulp.dest("./_posts")<% } %>
