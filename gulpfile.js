const {src, dest, watch, series} = require('gulp');

// CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// FONT
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');



function css(done) {
    src('./src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/css'))

    done()        
}

function imagen(done) {
    src('./src/img/**/*')
        .pipe(imagemin({optimizationLevel: 3}))
        .pipe(dest('./build/img'))

    done()        
}

function versionWebp(done) {
    src('./src/img/**/*.{jpg,png}')
        .pipe(webp())
        .pipe(dest('./build/img'))

    done()        
}

function versionAvif(done) {
    src('./src/img/**/*.{jpg,jpeg,png}')
        .pipe(avif())
        .pipe(dest('build/img'));

    done();        
}

function font(done) {
    src('./src/font/**/*')
        .pipe(dest('./build/font'))

    done()
}

function woff(done) {
    src('./src/font/**/*')
        .pipe(ttf2woff())
        .pipe(dest('./build/font'))

    done()        
}

function woff2(done) {
    src('./src/font/**/*')
        .pipe(ttf2woff2())
        .pipe(dest('./build/font'))

    done()        
}


function dev(done) {
    watch('./src/scss/**/*.scss', css)
    watch('./src/img/**/*', imagen)

    done()
}

exports.css = css;
exports.dev = dev;
exports.imagen = imagen;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.font = font;
exports.woff = woff;
exports.woff2 = woff2;
exports.default = series(imagen, versionWebp, versionAvif, font, woff, woff2, css, dev);