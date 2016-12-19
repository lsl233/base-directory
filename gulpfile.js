const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require("gulp-browserify");
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const scss = require('gulp-ruby-sass');
const imageMin = require('gulp-imagemin');
const concat = require('gulp-concat');
const through = require('through2');
const browserSync = require('browser-sync').create();
const glob = require('glob');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('dev', ['bowser-sync']);

gulp.task('bowser-sync', () => {
    let files = [
        './views/**/*.html',
        './dist/css/**/*.css',
        './src/js/**/*.js'
    ];

    browserSync.init(files, {
        proxy: '192.168.12.132:3334'
    });
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*.js', ['transform-es5']);
    gulp.watch('dist/js/**/*.js', ['browserify']);
});

/* '编译sass' */
gulp.task('scss', () => {
    scss('./src/scss/**/*.scss', {
            sourcemap: true
        })
        .on('error', scss.logError)
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('maps', {
            includeContent: false,
            sourceRoot: 'source'
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('transform-es5', () => {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-runtime']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('browserify', () => {
    return glob('./src/js/**_main.js', (err, files) => {
        console.log(err, files)
        files.map(entry => {
            gulp.src(entry)
                .pipe(browserify({
                    insertGlobals: true,
                    debug: true
                }))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist/js'))
        })
    });
});

gulp.task('js-min', () => {
    return gulp.src('./dist/js/*.bundle.js')
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))
});

/* '压缩图片' */
gulp.task('img-min', () => {
    return gulp.src('./src/images/**/*.+(png|jpg)')
        .pipe(imageMin())
        .pipe(gulp.dest('./dist/images'))
});

/* 去掉console.log */
gulp.task('comment-log', () => {
    return gulp.src('./src/js/**/live_room.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist/js'));
});
