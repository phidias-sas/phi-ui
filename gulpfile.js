// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass      = require('gulp-sass');
var concat    = require('gulp-concat');
var rename    = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

//error handler to log errors without interrupting 'watch'
function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

// Compile and minify Sass
gulp.task('sass', function() {
    return gulp.src(['src/scss/declarations/**/*.scss', 'src/scss/components/**/*.scss'])
    	.pipe(concat('phi-ui.css'))
        .pipe(sass()).on('error', swallowError)
        .pipe(gulp.dest('build'))
        .pipe(rename('phi-ui.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build'));
});

// duplicate all *.less files into *.scss files
gulp.task('renameLess', function() {
    return gulp.src('**/*.less')

        .pipe(rename(function (path) {
            path.extname = path.extname.replace('less', 'scss');
        }))

        .pipe(gulp.dest('.'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

// Fly!
gulp.task('default', ['sass', 'watch']);