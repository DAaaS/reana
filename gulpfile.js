
var gulp = require('gulp');
var express = require('express');

gulp.task('serve', function(){
	var app = express();

	app.use('/', express.static('app/client/'));
	app.use('/bower_components/', express.static('bower_components/'));

	app.listen(3000);
});

gulp.task('default', ['serve']);
