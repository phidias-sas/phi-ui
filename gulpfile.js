//Global installation
//npm install gulp gulp-concat gulp-rename gulp-sass gulp-minify-css gulp-uglify 

// Set the full path to the folder (only necessary when running gulp outside the project folder)
var basedir = "";

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass      = require('gulp-sass');
var concat    = require('gulp-concat');
var rename    = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var uglify    = require('gulp-uglify');

//error handler to log errors without interrupting 'watch'
function logError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Compile and minify Sass
gulp.task('sass', function() {
    return gulp.src([basedir+'src/core/styles/normalize/*.scss', basedir+'src/core/styles/mixins/**/*.scss', basedir+'src/components/**/*.scss'])
    	.pipe(concat('phi-ui.css'))
        .pipe(sass())
            .on('error', logError)
        .pipe(gulp.dest(basedir+'build'))
        .pipe(rename('phi-ui.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(basedir+'build'));
});

// Concatenate and minify javascript
gulp.task('js', function() {
    return gulp.src([basedir+'src/core/**/*.js', basedir+'src/components/**/*.js'])
        .pipe(concat('phi-ui.js'))
        .pipe(gulp.dest(basedir+'build'))
        .pipe(rename('phi-ui.min.js'))
        .pipe(uglify())
            .on('error', logError)
        .pipe(gulp.dest(basedir+'build'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(basedir+'src/**/*.scss', ['sass']);
    gulp.watch(basedir+'src/**/*.js', ['js']);
});

// Fly!
gulp.task('default', ['sass', 'js', 'watch']);