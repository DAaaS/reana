

var gulp = require('gulp');

gulp.task('web_tsc', function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false
  });
  return gulp.src('./app/web/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./app/web/js'));
});

gulp.task('server_tsc', function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false
  });
  return gulp.src('./app/server/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./app/server'));
});

gulp.task('tsc', ['web_tsc', 'server_tsc']);

gulp.task('tsd', function (callback) {
    var tsd = require('gulp-tsd');

    tsd({
        command: 'reinstall',
        config: './app/server/tsd.json'
    }, callback);

});

gulp.task('sass', function () {
  var sass = require('gulp-sass');
  return gulp.src('./app/web/scss/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./app/web/css'));
});

gulp.task('watch', function(){
  gulp.watch('./app/web/ts/**/**.ts', ['web_tsc']);
  gulp.watch('./app/server/**/**.ts', ['server_tsc']);
  gulp.watch('./app/web/scss/**/*.scss', ['sass']);
});

gulp.task('serve', ['watch'], function(){
  var gls = require('gulp-live-server');
  var server = gls(['./app/server/main.js']);
  gulp.watch(['./**/*.css', './**/*.js', './**/*.html'], function (file) {
    server.start.bind(server)();
  });
  server.start();
});

gulp.task('init', ['tsc', 'tsd', 'sass']);

gulp.task('default', ['tsc', 'sass', 'serve']);
