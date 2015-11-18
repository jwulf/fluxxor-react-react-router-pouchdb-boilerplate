var gulp                = require('gulp'),
    browserify          = require('browserify'),
    historyApiFallback  = require('connect-history-api-fallback'),
    less                = require('gulp-less'),
    plumber             = require('gulp-plumber'),
    del                 = require('del'),
    babelify            = require('babelify'),
    connect             = require('gulp-connect');

gulp.task('clean', function (cb) {
  del(['build/*'], cb);
});

gulp.task('copy', ['clean'], function() {
  gulp.src('src/images/**')
    .pipe(gulp.dest('build/images/'));

    gulp.src('node_modules/font-awesome/fonts/**')
      .pipe(gulp.dest('build/fonts/'));

    return gulp.src('node_modules/ratchet/dist/fonts/**')
      .pipe(gulp.dest('build/fonts/'));
});

gulp.task('less', ['copy'], function () {
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('build/css/'))
    .pipe(connect.reload());
});

gulp.task('build-js', ['less'], function() {

  return browserify('./src/js/app.js')
    .transform(babelify.configure({
         optional: ["es7.classProperties", "es7.functionBind", "es7.decorators", "es7.objectRestSpread"]
      }))
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js/'))
    .pipe(connect.reload());
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch('./src/less/**.less', ['less']);
  gulp.watch('./src/js/**/*', ['build-js']);
});

// Development
gulp.task('serve', function () {
	connect.server({
		root: 'build',
		host: '*',
		port: 8000,
		livereload: true,
    middleware: function(connect, opt) {
        return [ historyApiFallback({
        }) ];
    }
	});
});
