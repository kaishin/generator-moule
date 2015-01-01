browserSync = require "browser-sync"
cache = require "gulp-cached"
coffee = require "gulp-coffee"
del = require "del"
gulp = require "gulp"
gutil = require "gulp-util"
mediaQueries = require "gulp-combine-media-queries"
prefix = require "gulp-autoprefixer"
sass = require "gulp-sass"
shell = require "gulp-shell"

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
  jekyllFiles: ["#{sourceFolder}/**/*.md", "#{sourceFolder}/**/*.html", "#{sourceFolder}/**/*.xml"]

gulp.task "default", ["develop"]
gulp.task "develop", ["browser-sync", "watch"]
gulp.task "build", ["sass", "coffee", "jekyll-build:prod"]

gulp.task "clean",
  del.bind(null, ["_site"])

gulp.task "watch", ["sass", "coffee", "jekyll-build:dev"], ->
  gulp.watch "#{paths.sass}/*.scss", ["sass"]
  gulp.watch "#{paths.coffee}/*.coffee", ["coffee"]
  gulp.watch paths.jekyllFiles, ["jekyll-rebuild"]

gulp.task "jekyll-build:dev",
  shell.task "jekyll build --config _config.yml,_config.serve.yml", quiet: true
  browserSync.notify messages.jekyllBuild

gulp.task "jekyll-build:prod",
  shell.task "jekyll build"

gulp.task "doctor",
  shell.task "jekyll doctor"

gulp.task "sass", ->
  gulp.src("#{paths.sass}/*.scss")
    .pipe sass
      errLogToConsole: true
      precision: 2
    .pipe prefix ["last 2 versions", "> 2%", "ie 11", "Firefox ESR"], cascade: false
    .pipe mediaQueries()
    .pipe gulp.dest(paths.destinationStyles)
    .pipe gulp.dest(paths.styles)
    .pipe browserSync.reload(stream: true)

gulp.task "coffee", ->
  gulp.src("#{paths.coffee}/*.coffee")
    .pipe cache paths.coffee
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
    port: 4000
    open: true
    browser: "chrome"
