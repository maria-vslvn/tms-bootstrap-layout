import pkg from 'gulp';
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import clean from 'gulp-clean';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from "browser-sync";

const sass = gulpSass(dartSass)
const { src, dest, watch, series, parallel } = pkg;
const sassOpts = { outputStyle: 'compressed', errLogToConsole: true }; // "let" and "const"!!


const sync = browserSync.create()
function browsersyncServe() {
  sync.init({
    server: {
      baseDir: '.'
    }
  });
}

function browsersyncReload(){
  sync.reload({stream: true});
}

function styles() {
  return src('src/assets/scss/*.scss')
    .pipe(sass(sassOpts))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(dest('dist/css'))
}

const pics = () => {
  return src('src/assets/img/**/*')
    .pipe(dest('dist/img'))
}

const devWatch = () => {
  browsersyncServe()
  watch(['src/assets/img/**/*', 'src/assets/scss/*.scss'], parallel(pics, styles)).on('change', sync.reload);
  watch('*.html').on('change', sync.reload);
};

const dirClean = () => {
    return src(['dist/css/*', 'dist/img/*'], {read: false})
    .pipe(clean());
}

const dev = series(parallel(dirClean, styles, pics), devWatch);

export default dev