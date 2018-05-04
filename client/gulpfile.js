var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var es = require('event-stream'),
    rename = require('gulp-rename'),
    paths = {
    pages: ['src/*.html']
};

let bundles = [
    'src/main.ts',
    'src/workers/geometry.ts',
    'src/workers/oimo.js',
    'src/workers/static-collisions.ts',
    'src/workers/systems.ts'
]

gulp.task('default', function () {
    
    var tasks = bundles.map(function(entry, i) {
        return browserify({
            basedir: '.',
            debug: true,
            entries: [entry],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015', 'react'],
            extensions: ['.js', '.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(rename({ prefix: i == 0 ? "" : entry.split("/").pop().split(".")[0]+"-" }))
        .pipe(gulp.dest(i == 0 ? '../web/js' : '../web/js/workers'));
    });

    return es.merge.apply(null, tasks);

});