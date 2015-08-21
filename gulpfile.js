//Global installation
//npm install gulp gulp-concat gulp-rename gulp-sass gulp-minify-css gulp-uglify 

// Set the full path to the phi-ui folder (only necessary when running gulp outside the project folder)
var projectFolder = "";

// Folder to store the compiled files
var buildFolder = projectFolder + '/public/build';

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
            projectFolder+'/src/style/**/*.scss',
            projectFolder+'/src/components/**/*.scss',
            projectFolder+'/src/states/**/*.scss'
        ])

        .pipe(concat('phi-ui.css'))
        .pipe(sass())
            .on('error', logError)
        .pipe(gulp.dest(buildFolder))
        .pipe(rename('phi-ui.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(buildFolder));
});

// Copy all .html files in public/partials
gulp.task('html', function() {
    return gulp.src(projectFolder+'/src/states/**/*.html')
        .pipe(gulp.dest(projectFolder+'/public/partials'));
});

// Concatenate and minify javascript
gulp.task('js', function() {

    return gulp.src([

            projectFolder+'/src/vendor/**/*.js',

            projectFolder+'/src/module.js',
            projectFolder+'/src/config.js',
            projectFolder+'/src/run.js',
            projectFolder+'/src/components/**/*.js',
            projectFolder+'/src/states/**/*.js'
        ])

        .pipe(concat('phi-ui.js'))
        .pipe(gulp.dest(buildFolder))
        .pipe(rename('phi-ui.min.js'))
        .pipe(uglify())
            .on('error', logError)
        .pipe(gulp.dest(buildFolder));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(projectFolder+'/src/**/*.js',   ['js']);
    gulp.watch(projectFolder+'/src/**/*.html', ['html']);
    gulp.watch(projectFolder+'/src/**/*.scss', ['sass']);

});

// Fly!
gulp.task('default', ['js', 'html', 'sass', 'watch']);