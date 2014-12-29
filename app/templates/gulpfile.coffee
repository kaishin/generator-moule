gulp = require "gulp"
del = require "del"
browserSync = require "browser-sync"
sass = require "gulp-sass"
coffee = require "gulp-coffee"
prefix = require "gulp-autoprefixer"
shell = require "gulp-shell"

messages = jekyllBuild: "Rebuilding Jekyll..."

gulp.task "default", ["browser-sync", "watch"]

gulp.task "clean",
  del.bind(null, ["_site"])

gulp.task "watch", ->
  gulp.watch "_scss/*.scss", ["sass"]
  gulp.watch "_coffeescript/*.coffee", ["coffee"]
  gulp.watch ["index.html", "_layouts/*.html", "_posts/*"], ["jekyll-rebuild"]

gulp.task "jekyll-build:dev",
  browserSync.notify messages.jekyllBuild
  shell.task "jekyll build"

gulp.task "jekyll-build:prod",
  shell.task "jekyll build --config _config.yml,_config.build.yml"

gulp.task "doctor",
  shell.task "jekyll doctor"

gulp.task "sass", ->
  gulp.src("_scss/main.scss")
    .pipe sass(bundleExec: true)
    .pipe prefix(["last 15 versions", "> 1%", "ie 8", "ie 7" ], cascade: true)
    .pipe gulp.dest("_site/css")
    .pipe browserSync.reload(stream: true)
    .pipe gulp.dest("css")

gulp.task "coffee", ->
  gulp.src("_coffeescript/main.coffee")
    .pipe coffee bare: true
    .pipe gulp.dest("_site/js")
    .pipe browserSync.reload(stream: true)
    .pipe gulp.dest("js")

gulp.task "jekyll-rebuild", ["jekyll-build:dev"], ->
  browserSync.reload()

gulp.task "browser-sync", ["sass", "coffee", "jekyll-build"], ->
  browserSync.init null,
    server:
      baseDir: "_site"
    host: "localhost"
