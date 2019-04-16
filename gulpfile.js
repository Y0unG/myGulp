// Connecting gulp
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
//const watch = require('gulp-watch');


//Array for CSS files
const cssFiles = ['./src/**/*.css']

//Array for JS files
const jsFiles = ['.src/js/**/*.js']

//Compile SCSS to CSS and write that to css dir
gulp.task('sass-compile', function (){
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/css'))
});

// Task for styles CSS
function styles() {
    //All CSS files
    return gulp.src(cssFiles)
    //Consociation(combine) of CSS files
    .pipe(concat('style.css'))
    //Autoprefixer
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    //Minify CSS
    .pipe(cleanCSS({
        level: 2
    }))
    //Outside directory
    .pipe(gulp.dest('./build/css'))
    //Watching
    .pipe(browserSync.stream());

}



// Task for scripts JS
function scripts() {
//All JS files
return gulp.src(jsFiles)
//Consociation(combine) of JS files
    .pipe(concat('script.js'))
//Uglify JS
    .pipe(uglify({
        toplevel: true
    }))
//Outside directory
    .pipe(gulp.dest('./build/js'))
//Watching
    .pipe(browserSync.stream());

}

//Cleaning build directory
function clean() {
    return del(['build/*'])
}

//Looking for Files
function watch () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Watching CSS files
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass-compile', 'styles'))
    //Watching JS files
    gulp.watch('./src/js/**/*.js', scripts)
    //Watching HTML files
    gulp.watch('./**/*.html').on('change', browserSync.reload);
}

// Task calling function styles
gulp.task('styles', styles);
//task calling function sripts
gulp.task('scripts', scripts);
//Task calling function clean
gulp.task('del', clean);
//Task calling function watch
gulp.task('watch', watch);
//Cleaning and running styles and scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
//Full build
gulp.task('dev', gulp.series('build','watch'));