var gulp = require('gulp');
var template = require('gulp-template');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var fs = require('fs');
var gutil = require('gulp-util');

gulp.task('styles', function() {
  return gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest('./app/css/'))
    .pipe(livereload())
});

gulp.task('templates', function () {
  var templates = {};
  var files = fs.readdirSync('./pages/partials')
      .filter(function(file) {
        // return filename
        if (file.charAt(0) === '_') {
          return file;
        }

      })
      // add them to the templates object
      .forEach(function(template) {
        var slug = template.replace('_', '').replace('.html', '');
        templates[slug] = fs.readFileSync("./pages/partials/" + template, "utf8");
      });

  return gulp.src(['./pages/*.html'])
      .pipe(template(templates))
      .on('error', gutil.log)
      .pipe(gulp.dest('./app'))
      .pipe(livereload());
});

// Watch task
gulp.task('default',function() {
  // run task initially, after that watch
  gulp.parallel(['styles', 'templates'])();
  livereload.listen({port: 3001});
  gulp.watch('./scss/*.scss', gulp.series('styles'));
  gulp.watch('pages/**/*.html', gulp.series('templates'));
});
