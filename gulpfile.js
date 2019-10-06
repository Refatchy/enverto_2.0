var gulp =require('gulp');
var babel = require('gulp-babel');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var wait = require("gulp-wait");
var uglify = require('gulp-uglify');
var browserSync = require("browser-sync").create();
var styleSRC = 'src/scss/**/*.scss';
var styleDIST = 'dist/css/';
var gulpIf = require("gulp-if");
var babelify = require("babelify");
var jsSRC = 'src/js/**/*.js';
var jsDIST = 'dist/js/';


gulp.task('style', function(){
  return  gulp.src(styleSRC)
    
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 99 versions'))
    .pipe( rename( { suffix: '.min' } ) )
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest( styleDIST ));
});

gulp.task('js', function(){
  //  return gulp.src( jsSRC )
  //   .pipe( gulp.dest( jsDIST) ); 
  return gulp
      .src(jsSRC)
      .pipe(wait(400))
      .pipe(babel())
      .pipe(gulpIf("*.js", uglify()))
      .pipe(rename({ suffix: ".min" }))
      // .pipe(gulp.dest("src/js/es5"))
      .pipe(gulp.dest("dist/js/es5"));

});

gulp.task('default',  gulp.series(['style', 'js']));


function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    // startPath: "index.html"
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watchFiles() {
    gulp.watch('src/scss/**/*.scss' ,  gulp.series("style", browserSyncReload));
    gulp.watch( 'src/js/**/*.js', gulp.series("js", browserSyncReload));
    gulp.watch("*.html", gulp.series(browserSyncReload));
    
  }

  gulp.task(
    "default",
    gulp.series("style", "js", browserSyncInit, watchFiles)
  );