gulp = require "gulp"
del = require "del"
browserSync = require "browser-sync"
sass = require "gulp-sass"
coffee = require "gulp-coffee"
prefix = require "gulp-autoprefixer"
shell = require "gulp-shell"
gutil = require "gulp-util"

messages =
  jekyllBuild: "Rebuilding Jekyll..."

sourceFolder = "./source"
destinationFolder = "./_site"

paths =
  sass: "#{sourceFolder}/_scss/"
  coffee: "#{sourceFolder}/_coffee/"
  styles: "#{sourceFolder}/css/"
  destinationStyles: "#{destinationFolder}/css/"
  scripts: "#{sourceFolder}/scripts/"
  destinationScripts: "#{destinationFolder}/scripts/"

gulp.task "default", ["develop"]
gulp.task "develop", ["browser-sync", "watch"]
gulp.task "build", ["sass", "coffee", "jekyll-build:prod"]

gulp.task "clean",
  del.bind(null, ["_site"])

gulp.task "watch", ["sass", "coffee", "jekyll-build:dev"], ->
  gulp.watch "_scss/*.scss", ["sass"]
  gulp.watch "_coffeescript/*.coffee", ["coffee"]
  gulp.watch ["index.html", "_layouts/*.html", "_posts/*"], ["jekyll-rebuild"]

gulp.task "jekyll-build:dev",
  shell.task "jekyll build"
  browserSync.notify messages.jekyllBuild

gulp.task "jekyll-build:prod",
  shell.task "jekyll build --config _config.yml,_config.build.yml"

gulp.task "doctor",
  shell.task "jekyll doctor"

gulp.task "sass", ->
  gulp.src("#{paths.sass}/*.scss")
    .pipe sass
      errLogToConsole: true
      outputStyle: "compressed"
      precision: 2
    .pipe prefix ["last 2 versions", "> 2%", "ie 11", "Firefox ESR"], cascade: false
    .pipe gulp.dest(paths.destinationStyles)
    .pipe gulp.dest(paths.styles)
    .pipe browserSync.reload(stream: true)

gulp.task "coffee", ->
  gulp.src("#{paths.coffee}/*.coffee")
    .pipe coffee bare: true
    .on "error", (error) -> gutil.log(error.message)
    .pipe gulp.dest(paths.destinationScripts)
    .pipe gulp.dest(paths.scripts)
    .pipe browserSync.reload(stream: true)

gulp.task "jekyll-rebuild", ["jekyll-build:dev"], ->
  browserSync.reload()

gulp.task "browser-sync", ->
  browserSync.init null,
    server:
      baseDir: "_site"
    host: "localhost"
    open: true
    browser: "chrome"
