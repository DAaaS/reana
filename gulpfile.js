

var gulp = require('gulp');

gulp.task('client_tsc', function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false
  });
  return gulp.src('./app/client/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./app/client/js'));
});

gulp.task('server_tsc', function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false
  });
  return gulp.src('./app/server/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./app/server/js'));
});

gulp.task('tsc', ['client_tsc', 'server_tsc']);

gulp.task('tsd', function (callback) {
    var tsd = require('gulp-tsd');

    tsd({
        command: 'reinstall',
        config: './app/server/ts/tsd.json'
    }, callback);

});

gulp.task('sass', function () {
  var sass = require('gulp-sass');
  return gulp.src('./app/client/scss/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./app/client/css'));
});

gulp.task('watch', function(){
  gulp.watch('./app/client/ts/**/**.ts', ['client_tsc']);
  gulp.watch('./app/server/ts/**/**.ts', ['server_tsc']);
  gulp.watch('./app/client/scss/**/*.scss', ['sass']);
});

gulp.task('serve', ['watch'], function(){
  var gls = require('gulp-live-server');
  var server = gls(['./app/server/js/main.js']);
  gulp.watch(['./**/*.css', './**/*.js', './**/*.html'], function (file) {
    server.start.bind(server)();
  });
  server.start();
});

gulp.task('init', ['tsc', 'tsd', 'sass']);

gulp.task('default', ['tsc', 'sass', 'serve']);
