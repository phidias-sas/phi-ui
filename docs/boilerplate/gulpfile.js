// Include gulp
var gulp      = require('gulp');


// Include Our Plugins
var concat    = require('gulp-concat');
var rename    = require('gulp-rename');
var sass      = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var uglify    = require('gulp-uglify');


//error handler to log errors without interrupting 'watch'
function logError(error) {
    console.log(error.toString());
    this.emit('end');
}


// Concatenate and minify javascript
gulp.task('js', function() {
    return gulp.src(['src/*.js', 'src/*/**/*.js'])
        .pipe(concat('index.js'))
        //.pipe(gulp.dest('public'))
        .pipe(rename('index.min.js'))
        .pipe(uglify()).on('error', logError)
        .pipe(gulp.dest('public/res'));
});


// Copy all .html files in public/partials
gulp.task('html', function() {
    return gulp.src('src/states/**/*.html')
        .pipe(gulp.dest('public/partials'));
});


// Compile and minify Sass
gulp.task('sass', function() {
    return gulp.src('src/**/*.scss')
        .pipe(concat('index.css'))
        .pipe(sass()).on('error', logError)
        //.pipe(gulp.dest('public'))
        .pipe(rename('index.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/res'));
});


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/**/*.js',   ['js']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.scss', ['sass']);
});


// Fly!
gulp.task('default', ['js', 'html', 'sass', 'watch']);