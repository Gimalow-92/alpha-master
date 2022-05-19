"use strict"

let gulp = require('gulp'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  sassGlob = require('gulp-sass-glob'),
  browserSync = require('browser-sync').create();

const paths = {
  scss: {
    bootstrap: './node_modules/bootstrap/dist/css/bootstrap.css',
    slickLayout: './node_modules/slick-carousel/slick/slick.css',
    slickTheme: './node_modules/slick-carousel/slick/slick-theme.css',
    odoMeter: './node_modules/odometer/themes/odometer-theme-car.css',
    srcGlobalBase: './sass/base/style.scss',
    srcComponentsBase: './templates/components/**/*.base.scss',
    destBase: './css/base',
    srcGlobalLayout: './sass/layout/*.scss',
    srcComponentsLayout: './sass/layout/**/*.layout.scss',
    destLayout: './css/layout',
    srcGlobalTheme: './sass/theme/*.scss',
    srcComponentsTheme: './sass/theme/**/*.theme.scss',
    destTheme: './css/theme'
  },
  js: {
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    jquery: './node_modules/jquery/dist/jquery.min.js',
    jqueryValidation: './node_modules/jquery-validation/dist/jquery.validate.min.js',
    popper: './node_modules/popper.js/dist/umd/popper.min.js',
    slick: './node_modules/slick-carousel/slick/slick.min.js',
    odoMeter: './node_modules/odometer/odometer.min.js',
    srcGlobalJs: './global_js/main.js',
    srcBlazeAddonJs: './global_js/blazy-addon.js',
    srcFormsJs: './global_js/forms.js',
    srcComponentJs: './templates/components/**/*.js',
    dest: './js'
  }
};

// Cleanup build dirs before fresh build.
function cleanStyles() {
  return del([
    paths.scss.destBase,
    paths.scss.destLayout,
    paths.scss.destTheme
  ]);
}

function cleanJs() {
  return del([
    paths.js.dest,
  ]);
}

// Compile base into CSS & auto-inject into browsers
function baseStyles() {
  return gulp.src([paths.scss.bootstrap, paths.scss.srcGlobalBase, paths.scss.srcComponentsBase],{ allowEmpty: true })
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(sourcemaps.write())
    .pipe(cleanCss({rebase: false}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.destBase))
    .pipe(browserSync.stream());
}

// Compile layout into CSS & auto-inject into browsers
function layoutStyles() {
  return gulp.src([paths.scss.srcGlobalLayout, paths.scss.srcComponentsLayout, paths.scss.slickLayout],{ allowEmpty: true })
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(sourcemaps.write())
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.destLayout))
    .pipe(browserSync.stream());
}

// Compile sass into CSS & auto-inject into browsers
function themeStyles() {
  return gulp.src([paths.scss.srcGlobalTheme, paths.scss.srcComponentsTheme, paths.scss.slickTheme, paths.scss.odoMeter],{ allowEmpty: true })
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12']
    })]))
    .pipe(sourcemaps.write())
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.destTheme))
    .pipe(browserSync.stream());
}

// Move the javascript files into our js folder.
function js() {
  return gulp.src([paths.js.bootstrap, paths.js.jquery, paths.js.jqueryValidation, paths.js.odoMeter, paths.js.popper, paths.js.slick], {allowEmpty: true})
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

function themeJs() {
  return gulp.src([paths.js.srcGlobalJs, paths.js.srcBlazeAddonJs, paths.js.srcFormsJs, paths.js.srcComponentJs],{allowEmpty: true})
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Static Server + watching scss/html files.
function sass_watch() {
  gulp.watch([paths.scss.srcGlobalBase, paths.scss.srcComponentsBase], baseStyles).on('change', browserSync.reload);
  gulp.watch([paths.scss.srcGlobalLayout, paths.scss.srcComponentsLayout], layoutStyles).on('change', browserSync.reload);
  gulp.watch([paths.scss.srcGlobalTheme, paths.scss.srcComponentsTheme], themeStyles).on('change', browserSync.reload);
}

exports.baseStyles = baseStyles;
exports.layoutStyles = layoutStyles;
exports.themeStyles = themeStyles;
exports.js = js;
exports.themeJs = themeJs;
exports.sass_watch = sass_watch;
exports.cleanStyles = cleanStyles;
exports.cleanJs = cleanJs;

exports.sass = gulp.series(gulp.parallel(cleanStyles, cleanJs), gulp.parallel(baseStyles, layoutStyles, themeStyles, js, themeJs));
exports.sass_watch = sass_watch;

exports.default = gulp.series(gulp.parallel(cleanStyles, cleanJs), gulp.parallel(baseStyles, layoutStyles, themeStyles, js, themeJs));
exports.build = gulp.series(gulp.parallel(cleanStyles, cleanJs), gulp.parallel(baseStyles, layoutStyles, themeStyles, js, themeJs));
