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
    return gulp.src(['src/core/styles/normalize/*.scss', 'src/core/styles/mixins/**/*.scss', 'src/components/**/*.scss'])
    	.pipe(concat('phi-ui.css'))
        .pipe(sass())
            .on('error', logError)
        .pipe(gulp.dest('build'))
        .pipe(rename('phi-ui.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build'));
});

// Concatenate and minify javascript
gulp.task('js', function() {
    return gulp.src(['src/core/**/*.js', 'src/components/**/*.js'])
        .pipe(concat('phi-ui.js'))
        .pipe(gulp.dest('build'))
        .pipe(rename('phi-ui.min.js'))
        .pipe(uglify())
            .on('error', logError)
        .pipe(gulp.dest('build'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.js', ['js']);
});

// Fly!
gulp.task('default', ['sass', 'js', 'watch']);