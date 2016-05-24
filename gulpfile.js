

var gulp = require('gulp');

gulp.task('client_tsc', ['client_typings'], function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false,
    experimentalDecorators: true
  });
  return gulp.src('./app/client/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./build/app/client/js'));
});

gulp.task('server_tsc', ['server_typings'], function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false
  });
  return gulp.src('./app/server/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./build/app/server/js'));
});

gulp.task('tsc', ['client_tsc', 'server_tsc']);

gulp.task('server_typings', function (callback) {
  var gulpTypings = require("gulp-typings");
  return gulp.src("./app/server/ts/typings.json").pipe(gulpTypings());
});

gulp.task('client_typings', function (callback) {
  var gulpTypings = require("gulp-typings");
  return gulp.src("./app/client/ts/typings.json").pipe(gulpTypings());
});

gulp.task('typings', ['server_typings', 'client_typings']);

gulp.task('sass', function () {
  var sass = require('gulp-sass');
  return gulp.src('./app/client/scss/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./build/app/client/css'));
});

gulp.task('copy_html', function() {
   return gulp.src('./app/client/**/**.html').pipe(gulp.dest('./build/app/client'));
});

gulp.task('watch', function(){
  gulp.watch('./app/client/ts/**/**.ts', ['client_tsc']);
  gulp.watch('./app/server/ts/**/**.ts', ['server_tsc']);
  gulp.watch('./app/client/scss/**/**.scss', ['sass']);
  gulp.watch('./app/client/**/**.html', ['copy_html']);
});

gulp.task('serve', ['watch', 'server_tsc'], function(){
  var gls = require('gulp-live-server');
  var server = gls(['./build/app/server/js/main.js']);
  gulp.watch(['./build/**/*.css', './build/**/*.js', './build/**/*.html'], function (file) {
    server.start.bind(server)();
  });
  server.start();
});

gulp.task('init', ['tsc', 'sass', 'copy_html']);

gulp.task('default', ['init', 'serve']);
