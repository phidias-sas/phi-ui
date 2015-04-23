//Global installation
//npm install gulp gulp-concat gulp-rename gulp-sass gulp-minify-css gulp-uglify 

// Base name for generated files
var name = "phi-ui";

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

    return gulp.src([
            basedir+'/src/style/**/*.scss',
            basedir+'/src/components/**/*.scss',
            basedir+'/src/states/**/*.scss'
        ])

        .pipe(concat(name+'.css'))
        .pipe(sass())
            .on('error', logError)
        .pipe(gulp.dest(basedir+'/public/build'))
        .pipe(rename(name+'.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(basedir+'/public/build'));
});

// Copy all .html files in public/partials
gulp.task('html', function() {
    return gulp.src(basedir+'/src/states/**/*.html')
        .pipe(gulp.dest(basedir+'/public/partials'));
});

// Concatenate and minify javascript
gulp.task('js', function() {

    return gulp.src([

            basedir+'/src/vendor/**/*.js',

            basedir+'/src/module.js',
            basedir+'/src/config.js',
            basedir+'/src/run.js',
            basedir+'/src/components/**/*.js',
            basedir+'/src/states/**/*.js'
        ])

        .pipe(concat(name+'.js'))
        .pipe(gulp.dest(basedir+'/public/build'))
        .pipe(rename(name+'.min.js'))
        .pipe(uglify())
            .on('error', logError)
        .pipe(gulp.dest(basedir+'/public/build'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(basedir+'/src/**/*.js',   ['js']);
    gulp.watch(basedir+'/src/**/*.html', ['html']);
    gulp.watch(basedir+'/src/**/*.scss', ['sass']);

});

// Fly!
gulp.task('default', ['js', 'html', 'sass', 'watch']);