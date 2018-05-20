var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var url = require('url');
var proxy = require('proxy-middleware');
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

gulp.task('build', function () {
    var tasks = bundles.map(function(entry, i) {
        return browserify({
            basedir: '.',
            debug: true,
            entries: [entry],
            cache: {},
            packageCache: {},
            insertGlobalVars: {
                THREE: function(file, dir) {
                    return 'require("three")';
                }
            }
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
        .pipe(gulp.dest(i == 0 ? 'web/js' : 'web/js/workers'));
    });

    return es.merge.apply(null, tasks);
});


gulp.task('build-watch', ['build'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('move-bundle', function() {
    gulp.src(["js/web/bundle.js"])
    .pipe(gulp.dest('dist'));
});

// use default task to launch Browsersync and watch JS files
gulp.task('watch', ['build'], function () {
    var proxyOptions = url.parse('http://localhost:3007/api'),
        dataProxyOptions = url.parse('http://localhost:3007/data'),
        pageProxyOptions = url.parse('http://localhost:3007');
    proxyOptions.route = '/api';
    dataProxyOptions.route = '/data';
    pageProxyOptions.route = '/world'
    // Serve files from the root of this project
    browserSync.init({
        server: {
            open: false,
            port: 3006,
            baseDir: ['web'],
            middleware: [
                proxy(proxyOptions), 
                proxy(dataProxyOptions), 
                proxy(pageProxyOptions)]
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
     gulp.watch("src/**/*.ts", ['build-watch']);
    // var bundler = watchify('src/**/*.ts');

	// bundler.transform(hbsfy);

	// bundler.on('update', rebundle);

	// function rebundle() {
	// 	return bundler.bundle()
	// 		.pipe(source('bundle.js'))
	// 		.pipe(gulp.dest('web/js')).pipe(livereload());
	// }

	// return rebundle();
});