"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
          "fonts/**/*.{woff,woff2}",
          "img/**",
          "js/**",
          "*.html"
     ], {
       base: "source"
     })
     .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
});

  gulp.task("images", function() {
    return gulp.src("build/img/**/*.{png,jpg,svg}")
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true})
        imagemin.svgo()
      ]))
    .pipe(gulp.dest("build/img"));

  gulp.task("server", function () {
      server.init({
      server: "build/",
      notify: false,
      open: true,
      cors: true,
      ui: false
    });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html"));
});

gulp.task("refresh", function (done) ) {
  server.reload();
  done();
}

gulp.task("start", gulp.series("build", "server"));

gulp.task ("build", gulp.series (
    "clean",
    "copy",
    "css",
    "html"
  ));

