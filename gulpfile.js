/* eslint-disable */
// @ts-nocheck
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
require('dotenv').config();


const sourceDir = './scss';
const env = process.env.NODE_ENV;
const stylePath = './site/assets/template_vlad/css';
const minStylePath = process.env.STYLE_MIN_PATH ? process.env.STYLE_MIN_PATH : './site/assets/template_vlad/css';


gulp.task('build', () => {
  return gulp.src(sourceDir + '/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(sourceDir));
});


gulp.task('minify', () => {
  return gulp.src(sourceDir + '/style.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename(path => {
      path.basename += '.min';
      path.extname = '.css';
    }))
    .pipe(gulp.dest(sourceDir))
    .pipe(gulp.dest(minStylePath))
  ;
});


gulp.task('copy-style', () => {
  return gulp.src(sourceDir + '/style.css')
    .pipe(gulp.dest(stylePath));
});


gulp.task('watch', () => {
  gulp.watch(sourceDir + '/*.scss', gulp.parallel('build'));

  gulp.watch(sourceDir + '/style.css', gulp.parallel('copy-style'));

  if (env === 'production') {
    gulp.watch(sourceDir + '/style.css', gulp.parallel('minify'));
  }
});

gulp.task('default', gulp.parallel(
  'watch'
));
