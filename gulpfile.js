const gulp = require('gulp')
const gulplog = require('gulplog')
const debug = require('gulp-debug')
const path = require('path')
const named = require('vinyl-named')
const webpack = require('webpack')
const plumber = require('gulp-plumber')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const rev = require('gulp-rev')
const stylus = require('gulp-stylus')
const revReplace = require('gulp-rev-replace')
const autoprefixer = require('gulp-autoprefixer')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack/webpack.config')

const environment = process.env.NODE_ENV || 'development'
const DEBUG = environment !== 'production'

function end(done, debug = DEBUG) {
    return function () {
        if (!done.called && debug) {
            done.called = true
            done.call()
        }
    }
}

gulp.task('react', done => {
    return gulp.src('src/bootstrap.js')
        .pipe(named())
        .pipe(debug({title: 'after named:'}))
        .pipe(plumber())
        .pipe(debug({title: 'after plumber:'}))
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(debug({title: 'after webpack:'}))
        .pipe(gulpif(!DEBUG, uglify()))
        .pipe(gulp.dest(path.join('dist', 'js')))
        .on('data', end(done, DEBUG))
})

gulp.task('stylus', () => {
    return gulp.src('src/stylus/base.styl')
        .pipe(plumber())
        .pipe(stylus({
            compress: !DEBUG
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulpif(!DEBUG, rev()))
        .pipe(gulp.dest(path.join('dist', 'css')))
        .pipe(gulpif(!DEBUG, rev.manifest('stylus.json')))
        .pipe(gulpif(!DEBUG, gulp.dest('manifest')))
})

gulp.task('dist', ['react', 'stylus'], () => {
    return gulp.src('src/index.html')
        .pipe(gulpif(!DEBUG, revReplace({
            manifest: gulp.src('manifest/react.json'),
        })))
        .pipe(gulpif(!DEBUG, revReplace({
            manifest: gulp.src('manifest/stylus.json'),
        })))
        .pipe(gulp.dest('dist'))
})

gulp.task('watch', () => {
    gulp.watch('src/index.html', ['dist'])
    gulp.watch('src/**/*.styl', ['stylus'])
})

gulp.task('lint', () => {
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(require('gulp-eslint')())
        .pipe(require('gulp-eslint').failAfterError())
})

gulp.task('dev', ['dist', 'watch'], () => {
    require('gulp-nodemon')({
        script: './index.js',
        ignore: [
            'dist/',
            'node_modules/',
            'src/',
            'test/'
        ]
    })
})
