gulp = require "gulp"
browserSync = require "browser-sync"
sass = require "gulp-ruby-sass"
coffee = require "gulp-coffee"
prefix = require "gulp-autoprefixer"
process = require "child_process"

messages = jekyllBuild: "<span style=\"color: grey\">Running:</span> $ jekyll build"

gulp.task "default", ["browser-sync", "watch"]

gulp.task "watch", ->
  gulp.watch "_scss/*.scss", ["sass"]
  gulp.watch "_coffeescript/*.coffee", ["coffee"]
  gulp.watch ["index.html", "_layouts/*.html", "_posts/*"], ["jekyll-rebuild"]

gulp.task "jekyll-build", (done) ->
  browserSync.notify messages.jekyllBuild
  process.spawn("jekyll", ["build"],
    stdio: "inherit"
  ).on "close", done

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

gulp.task "jekyll-rebuild", ["jekyll-build"], ->
  browserSync.reload()

gulp.task "browser-sync", ["sass", "coffee", "jekyll-build"], ->
  browserSync.init null,
    server:
      baseDir: "_site"
    host: "localhost"
