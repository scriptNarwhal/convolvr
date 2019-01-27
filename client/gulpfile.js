var gulp = require('gulp');
var gutil = require("gulp-util");
var browserSync = require('browser-sync').create();
var url = require('url');
var proxy = require('proxy-middleware');
var browserify = require('browserify');
var watchify = require("watchify");
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var ts = require("gulp-typescript")
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
const merge = require('merge2'),
    rename = require('gulp-rename');

let insertGlobalVars = {
    THREE: function(file, dir) {
        return 'require("three")';
    }
};

let mainBundle =  'src/main.ts';

let bundles = [
    'src/workers/geometry.ts',
    'src/workers/oimo.js',
    'src/workers/static-collisions.ts',
    'src/workers/systems.ts'
]

let watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: [mainBundle],
    cache: {},
    packageCache: {},
    insertGlobalVars: insertGlobalVars
})
.plugin(tsify)
.transform('babelify', {
    presets: ['es2015', 'react'],
    extensions: ['.js', '.ts']
}));

function build (all = false) {
    let entryPoints = all ? [mainBundle, ...bundles] : bundles,
        tasks = entryPoints.map(function(entry, i) {
        return browserify({
            basedir: '.',
            debug: true,
            entries: [entry],
            cache: {},
            packageCache: {},
            insertGlobalVars: insertGlobalVars
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
        .pipe(rename({ prefix: i == 0 && all ? "" : entry.split("/").pop().split(".")[0]+"-" }))
        .pipe(gulp.dest(i == 0 && all ? 'web/js' : 'web/js/workers'));
    });

    return merge(tasks);
}

gulp.task('node-build', function() {
    const tsProject = ts.createProject('tsconfig.node.json');

    var tsResult = tsProject.src()
            .pipe(tsProject());
    return merge([
            tsResult.dts.pipe(gulp.dest('./definitions')),
            tsResult.js.pipe(
                gulp.dest(tsProject.config.compilerOptions.outDir)
            )
        ]);
});            

gulp.task('build', function() {
    return build(true);
});

gulp.task('build-workers', function() {
    return build()
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .on("error", gutil.log)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('web/js'));
}

gulp.task("default", ["build-workers"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);

function startBrowserSync() {
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
}

// use default task to launch Browsersync and watch JS files
gulp.task('browser-sync', ['build'], function() {
    startBrowserSync();

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
     gulp.watch("src/**/*.ts", ['browser-sync-reload']);
});

gulp.task('browser-sync-reload', ['build'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('move-bundle', function() {
    gulp.src(["web/js/bundle.js"])
    .pipe(gulp.dest('dist'));
    gulp.src(["web/js/workers/geometry-bundle.js"])
    .pipe(gulp.dest('dist'));
    gulp.src(["web/js/workers/oimo-bundle.js"])
    .pipe(gulp.dest('dist'));
    gulp.src(["web/js/workers/static-collisions-bundle.js"])
    .pipe(gulp.dest('dist'));
    gulp.src(["web/js/workers/systems-bundle.js"])
    .pipe(gulp.dest('dist'));
});