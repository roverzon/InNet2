'use strict';

const gulp   	= require('gulp');
const stylus 	= require('gulp-stylus');
const minifycss = require('gulp-minify-css');
const concat 	= require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('css', () => {
	gulp.src('css/**/*.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(concat('innet.min.css'))
		.pipe(minifycss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('assets'))
});

gulp.task('watch:css',['css'],() => {
	gulp.watch('css/**/*.styl',['css'])
});