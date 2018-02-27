'use strict';

/* ---------------------[ packages ]----------------------- */

var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    postcss = require('gulp-postcss'),
    svgo = require('gulp-svgo');

/* ---------------------[ directories ]----------------------- */

var directories = {
  'pug_watch':  ['pug/**/*.*'],
  'pug_src':    ['pug/*.pug'],
  'pug_build':  '../',
  'sass_watch': ['scss/**/*.scss'],
  'sass_src':   ['scss/*.scss'],
  'sass_compiled': 'css',
  'sass_parts': ['css/**/*.css'],
  'sass_build': '../css',
  'js_src':     ['js/**/*.js'],
  'js_build':   '../js',
  'svg_src':    ['img/**/*.svg'],
  'svg_build':  '../img'
}

/* ---------------------[ postcss plugins ]----------------------- */

var plugins = [
  autoprefixer({
    browsers:'last 4 versions'
  })
];

/* ---------------------[ tasks ]----------------------- */

// pug
gulp.task('compile_pug', function buildHTML() {
  return gulp.src(directories.pug_src)
  .pipe(pug({
    'pretty':true,
    'compileDebug': true
  }))
  .pipe(gulp.dest(directories.pug_build))
  .pipe(notify("HTML generated"));
});

// sass
gulp.task('compile_sass', function () {
  return gulp.src(directories.sass_src)
    .pipe(sass({sourceComments:1}).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(cleanCss())
    .pipe(gulp.dest(directories.sass_compiled))
    .pipe(notify("CSS generated"));
});

// Append css header to style.css

gulp.task('concatenate_css', function(){
  return gulp.src(directories.sass_parts)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(directories.sass_build))
    .pipe(notify("CSS concatenated"));
});

// concat_scripts
gulp.task('scripts', function() {
  return gulp.src(directories.js_src)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(directories.js_build))
    .pipe(notify("Scripts concatenated"));
});

gulp.task('optimize-svg', function(){
  return gulp.src(directories.svg_src)
        .pipe(svgo())
        .pipe(gulp.dest(directories.svg_build))
        .pipe(notify("SVG optimized"));
});

// watch
gulp.task('watch', function () {
  gulp.watch(directories.pug_watch, ['compile_pug']);
  gulp.watch(directories.sass_watch, ['compile_sass']);
  gulp.watch(directories.js_src, ['scripts']);
  gulp.watch(directories.sass_parts, ['concatenate_css']);
  gulp.watch(directories.svg_src, ['optimize-svg']);

});

/* ---------------------[ task collections ]----------------------- */

// build
gulp.task('build', ['compile_pug', 'compile_sass', 'scripts', 'optimize-svg']);

// Optimize svg files
gulp.task('svg',['optimize-svg']);

// default
gulp.task('default', ['compile_pug', 'compile_sass', 'scripts', 'optimize-svg', 'watch']);
