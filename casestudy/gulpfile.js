var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var jsonmin = require('gulp-jsonmin');

gulp.task('css', function(){
    // Autofollows includes
    gulp.src('./public/assets/css/main_v1.css')
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./dist/assets/css'))
});

gulp.task('js-vendor', function() {
    gulp.src([
        './public/assets/js/skel.js',
        './public/assets/js/jquery.poptrox.js', 
        './public/assets/js/jquery.scrollex.js',
        './public/assets/js/jquery.scrolly.min.js',
    ])
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'))
});

gulp.task('js-main', function() {
    gulp.src([
        './public/assets/js/util.js',
        './public/assets/js/main_v1.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'))
});

gulp.task('json', function() {
    gulp.src('./public/**/*.json')
        .pipe(jsonmin())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('html', function() {
    gulp.src('./public/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true, 
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
        }))
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('fonts', function() {
    gulp.src('./public/assets/fonts/*')
        .pipe(gulp.dest('./dist/assets/fonts'))
})

gulp.task('default', ['css', 'js-vendor', 'js-main', 'json', 'fonts', 'html']);