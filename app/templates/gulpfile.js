browserSync = require("browser-sync")
cache = require("gulp-cached")
del = require("del")
gulp = require("gulp")
gutil = require("gulp-util")
include = require("gulp-include")
minifyCSS = require("gulp-cssnano")
minifyJS = require("gulp-uglify")
prefix = require("gulp-autoprefixer")
runSequence = require("run-sequence")
sass = require("gulp-sass")
scssLint = require("gulp-scss-lint")
shell = require("gulp-shell")
<% if (hasBlog) { %>
argv = require("yargs").argv
dateFormat = require("dateformat")
rename = require("gulp-rename")
replace = require("gulp-replace")
slugify = require("underscore.string/slugify")
now = new Date()
title = argv.t || "Untitled"
dashedTitle = slugify(title)
<% } %>
messages = {
  jekyllBuild: "Rebuilding Jekyll..."
}

sourceFolder = "./source"
targetFolder = "./_site"

paths = {
  sourceStylesheets: sourceFolder + "/_scss/",
  sourceScripts: sourceFolder + "/_scripts/",
  targetStylesheets: targetFolder + "/css/",
  targetScripts: targetFolder + "/scripts/",
  jekyllFiles: [sourceFolder + "/**/*.html", sourceFolder + "/**/*.md", sourceFolder + "/**/*.yml", sourceFolder + "/**/*.xml", "!" + sourceFolder + "/node_modules/**/*", "!" + targetFolder + "/**/*"]
}

gulp.task("default", ["develop"])

gulp.task("develop", function() {
  runSequence(["watch", "browser-sync"])
})

gulp.task("build", function() {
  runSequence(["generate-css", "minify-scripts", "vendorize-scripts"], "lint-scss", "jekyll-build")
})

gulp.task("rebuild", function() {
  runSequence("jekyll-build-local", "reload")
})

gulp.task("clean", del.bind(null, ["_site"]))

gulp.task("watch", ["generate-css", "minify-scripts", "jekyll-build-local"], function() {
  gulp.watch(paths.sourceStylesheets + "/**/*.scss", ["generate-css"])
  gulp.watch(paths.sourceScripts + "/**/*.js", ["minify-scripts"])
  gulp.watch(paths.sourceScripts + "/vendor.js", ["vendorize-scripts"])
  gulp.watch(paths.jekyllFiles, ["rebuild"])
})

gulp.task("jekyll-build-local", shell.task("bundle exec jekyll build --incremental --config _config.yml,_config.serve.yml", {
  quiet: true
}))

gulp.task("jekyll-build", shell.task("bundle exec jekyll build --incremental"))

gulp.task("reload", function() {
  browserSync.reload()
})

gulp.task("doctor", shell.task("jekyll doctor"))

gulp.task("generate-css", function() {
  gulp.src(paths.sourceStylesheets + "/*.scss")
  .pipe(sass({
    errLogToConsole: true,
    precision: 2
  }))
  .pipe(prefix(["last 2 versions", "> 2%", "ie 11", "Firefox ESR"], {
    cascade: false
  }))
  .pipe(cache(paths.targetStylesheets))
  .pipe(minifyCSS())
  .pipe(gulp.dest(paths.targetStylesheets))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task("lint-scss", function() {
  gulp.src(paths.sourceStylesheets + "/*.scss")
  .pipe(cache(paths.sourceStylesheets))
  .pipe(scssLint({
    "config": ".scss-lint.yml",
    "bundleExec": true
  }))
  .pipe(scssLint.failReporter())
  .on("error", function(error) { gutil.log(error.message) })
})

gulp.task("minify-scripts", function() {
  gulp.src([paths.sourceScripts + "/*.js", "!" + paths.sourceScripts + "/vendor.js"])
  .pipe(cache("minify-scripts"))
  .pipe(minifyJS())
  .pipe(gulp.dest(paths.targetScripts))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task("vendorize-scripts", function() {
  gulp.src(paths.sourceScripts + "/vendor.js")
  .pipe(include())
  .on("error", function(error) { gutil.log(error.message) })
  .pipe(cache("vendorize-scripts"))
  .pipe(minifyJS())
  .pipe(gulp.dest(paths.targetScripts))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task("browser-sync", function() {
  browserSync.init(null, {
    server: {
      baseDir: targetFolder
    },
    host: "localhost",
    port: 4000
  })
})
<% if (hasBlog) { %>
gulp.task("post", function() {
  gulp.src("./_posts/_template.md")
  .pipe(rename((dateFormat(now, 'yyyy-mm-dd')) + "-" + dashedTitle + ".md"))
  .pipe(replace(/DATE_PLACEHOLDER/g, "" + (dateFormat(now, 'yyyy-mm-dd hh:MM:ss o'))))
  .pipe(replace(/TITLE_PLACEHOLDER/g, dashedTitle))
  .pipe(gulp.dest("./_posts"))
})
<% } %>
