/*Конфигурация и настройка сборки true-разработка*/
const isDevelopment = true;
const tempFolder = './';

//
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const minifycss = require('gulp-csso');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');

// SVG sprite
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');


const moduleJS = [
    tempFolder + 'js/main.js'
];

const vendorJs = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery.maskedinput/src/jquery.maskedinput.js',
    'node_modules/selectize/dist/js/standalone/selectize.js',
    'node_modules/swiper/dist/js/swiper.js',
];


const vendorCss = [
    'node_modules/font-awesome/css/font-awesome.css',
    'node_modules/normalize.css/normalize.css',
    'node_modules/selectize/dist/css/selectize.default.css',
    'node_modules/swiper/dist/css/swiper.css',
];


//scss
gulp.task('sass', function () { // Создаем таск "sass"
    return gulp.src(tempFolder + 'css/main.scss') // Берем источник
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
        // .pipe(gcmq())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(tempFolder + 'css/')) // Выгружаем результата в папку app/css
    // .pipe(browserSync.stream());
});

// scripts JS
gulp.task('build:js', function () {
    return gulp.src(moduleJS)
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(tempFolder + 'js/'))
});

/* -------- Объединение всех подключаемых плагинов в один файл -------- */
gulp.task('vendor:js', function () {
    return gulp
        .src(vendorJs)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/'));
});


/*css*/
gulp.task('vendor:css', function () {
    return gulp
        .src(vendorCss)
        .pipe(concat('vendor.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(tempFolder + 'css/'));
});
/*-------------------------------END----------------------------------------*/

/*SVG*/
// svg
gulp.task('build:svg', function () {
    return gulp.src(tempFolder + 'images/icons/*.svg')
    // минифицируем svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // удалить все атрибуты fill, style and stroke в фигурах
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        // cheerio плагин заменит, если появилась, скобка '&gt;', на нормальную.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprite.svg',
                    example: {
                        dest: '../spriteSvgDemo.html' // демо html
                    }
                }
            }
        }))
        .pipe(gulp.dest(tempFolder + 'images/icons/'));
});
/*END SVG*/


// watcher
gulp.task('watch', function () {
    gulp.watch(tempFolder + 'scss/**/*.scss', ['sass']);
    gulp.watch(tempFolder + 'js/*.js', ['build:js']);
});

// Выполнить билд проекта
gulp.task('build', function (callback) {
    runSequence([
        'sass',
        // 'build:js',
        'vendor:js',
        'vendor:css',
        'build:svg'
    ], callback);
});


// default
gulp.task('default', ['watch']);


/*// default
gulp.task('default', ['browser-sync', 'watch']);*/

// запускаем сервер надо разбираться
gulp.task('browser-sync', [
    'sass',
    'build:js',
    'vendor:jsPre',
    'vendor:jsPost',
    'vendor:css'
], function () {
    browserSync.init({
        proxy: "default"
    });
    // наблюдаем и обновляем
    browserSync.watch(['./**/*.*', '!**/*.css'], browserSync.reload);
});

