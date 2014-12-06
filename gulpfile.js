'use strict';

var del = require('del');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var paths = {
  coverage: 'coverage/',
  dist: 'dist/',
  src: ['index.js'],
  test: ['test/**/*.spec.js']
};

var defaultTasks = ['clean', 'lint', 'test', 'dist'];

gulp.task('lint', function() {
  return gulp.src(paths.test.concat(paths.src, __filename))
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function() { // synchronous
  del([paths.coverage, paths.dist]);
});

gulp.task('dist', function() {
  return gulp.src(paths.src, { read: false })
    .pipe(plumber())
    .pipe(browserify({
      debug: true, // generate sourcemap
      insertGlobals: false,
      standalone: 'segue'
    }))
    .pipe(rename({
      basename: 'segue'
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', function(cb) {
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.test)
        .pipe(jasmine({
          verbose: true,
          includeStackTrace: true
        }))
        .on('error', function(err) {
          cb(err);
        })
        .pipe(istanbul.writeReports({
          dir: paths.coverage,
          reporters: ['lcov']
        }));
    });
});

gulp.task('watch', defaultTasks, function() {
  gulp.watch(paths.test.concat(paths.src), defaultTasks);
});

gulp.task('default', defaultTasks);
