'use strict';
const gulp		 = require('gulp');
const concat	 = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify 	 = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate') ;

gulp.task('js',() => {
	gulp.src(['ng/**/*.module.js','ng/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('innet.min.js'))
		.pipe(ngAnnotate())
		// .pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('assets'))
});

gulp.task('watch:js',['js'],() => {
	gulp.watch('ng/**/*.js',['js']);
});