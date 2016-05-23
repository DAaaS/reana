

var gulp = require('gulp');

gulp.task('client_tsc', function(){
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject({
    removeComments: true,
    target: 'ES3',
    module: 'commonjs',
    declarationFiles: false
  });
  return gulp.src('./app/client/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./build/app/client/js'));
});

gulp.task('server_tsc', function(){
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

gulp.task('tsd', function (callback) {
    var tsd = require('gulp-tsd');
    tsd({
        command: 'reinstall',
        config: './app/server/ts/tsd.json'
    }, callback);

});

gulp.task('sass', function () {
  var sass = require('gulp-sass');
  return gulp.src('./app/client/scss/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./build/app/client/css'));
});

gulp.task('copy_assets', function () {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/es6-shim/es6-shim.map'
  ]).pipe(gulp.dest('build/app/client/js/lib'));
});

gulp.task('copy_html', function() {
   gulp.src('./app/client/**/*.html').pipe(gulp.dest('./build/app/client'));
});

gulp.task('watch', function(){
  gulp.watch('./app/client/ts/**/**.ts', ['client_tsc']);
  gulp.watch('./app/server/ts/**/**.ts', ['server_tsc']);
  gulp.watch('./app/client/scss/**/*.scss', ['sass']);
  gulp.watch('./app/client/**/*.html', ['copy_html']);
});

gulp.task('serve', ['watch'], function(){
  var gls = require('gulp-live-server');
  var server = gls(['./build/app/server/js/main.js']);
  gulp.watch(['./build/**/*.css', './build/**/*.js', './build/**/*.html'], function (file) {
    server.start.bind(server)();
  });
  server.start();
});

gulp.task('init', ['tsc', 'tsd', 'sass', 'copy_html', 'copy_assets']);

gulp.task('default', ['serve']);
