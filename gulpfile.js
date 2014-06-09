var Q = require('kew');
var map = require('./gulp-map');
var gulp = require('gulp');
var debug = require('gulp-debug');
var gutil = require('gulp-util');

var test = ['gulp-map.js', 'gulpfile.js'];

gulp.task('asyncMap', function(){
	return gulp.src(test)
		.pipe(map(function(file){
			return Q.delay(1337).then(function(){
				file.tags = ['async'];
				return file;
			})
		}))
		.pipe(map(function(file){
			gutil.log(file.relative, {tags: file.tags});
			return file;
		}));
});

// also works async, just return undefined from your promise
gulp.task('filter', function(){
	return gulp.src(test)
		.pipe(map(function(file){
			if (file.path.match(/gulpfile/))
				return file;
		}))
		.pipe(debug());
});

gulp.task('syncMap', function(){
	return gulp.src(test)
		.pipe(map(function(file){
			file.tags = ['foo','bar']
			return file;
		}))
		.pipe(map(function(file){
			gutil.log(file.relative, {tags: file.tags});
			return file;
		}))
});

gulp.task('default', ['syncMap','filter','asyncMap']);