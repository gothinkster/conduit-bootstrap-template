const gulp = require("gulp");
const template = require("gulp-template");
const server = require("gulp-server-livereload");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const fs = require("fs");
const gutil = require("gulp-util");

const cleanOptions = { compatibility: "ie9" };
const serverOptions = {
  livereload: true,
  directoryListing: false,
  open: true
};

gulp.task("styles", function() {
  gulp
    .src("./scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS(cleanOptions))
    .pipe(gulp.dest("./app/css/"));
});

gulp.task("templates", function() {
  const templates = {};
  const files = fs
    .readdirSync("./pages/partials")
    .filter(function(file) {
      // return filename
      if (file.charAt(0) === "_") {
        return file;
      }
    })
    // add them to the templates object
    .forEach(function(template) {
      const slug = template.replace("_", "").replace(".html", "");
      templates[slug] = fs.readFileSync("./pages/partials/" + template, "utf8");
    });

  return gulp
    .src(["./pages/*.html"])
    .pipe(template(templates))
    .on("error", gutil.log)
    .pipe(gulp.dest("./app"));
});

// Watch task
gulp.task("default", function() {
  // run task initially, after that watch
  gulp.start(["styles", "templates"]);
  gulp.watch("./scss/*.scss", ["styles"]);
  gulp.watch("pages/**/*.html", ["templates"]);
  gulp.src("./app").pipe(server(serverOptions));
});
