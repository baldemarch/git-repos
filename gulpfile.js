const browserSync   = require('browser-sync').create();
const reload        = browserSync.reload();
const gulp          = require('gulp');
const runSequence   = require('run-sequence');
const del           = require('del');
const concat        = require('gulp-concat');
const strip_debug   = require('gulp-strip-debug');
const inject        = require('gulp-inject');
const debug         = require('gulp-debug');
const watch         = require('gulp-watch');
var less            = require('gulp-less');
var path            = require('path');

const appDir    = './app';
const sourceDir = `${appDir}/src`;
const buildDir  = 'build/';

const paths = {
  libs: [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.min.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js'
  ],
  angular: [
    './app/src/js/index.js',
    './app/src/js/services/*.js',
    './app/src/js/controllers/*.js',
    './app/src/js/directives/*.js'
  ],
  less: [
    './app/src/less/*.less'
  ],
  css: [
    './bower_components/bootstrap/dist/css/bootstrap.min.css',
    './bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
  ],
  fonts: [
    './bower_components/bootstrap/dist/fonts/*'
  ]
};

gulp.task('clean', function(cb) {
  return del([buildDir], cb);
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: buildDir
  });
});

gulp.task('libs', () => {
  return gulp.src(paths.libs)
    .pipe(debug())
    .pipe(concat('global.js'))
    .pipe(strip_debug())
    .pipe(gulp.dest(buildDir + '/js/libs/'));
});

gulp.task('css', () => {
  return gulp.src(paths.css)
    .pipe(debug())
    .pipe(concat('global.css'))
    .pipe(gulp.dest(`${buildDir}/css/`));
});

gulp.task('less', () => {
  return gulp.src(`${sourceDir}/less/main.less`)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(`${buildDir}/css/`));
});

gulp.task('fonts',function (){
  return gulp.src(paths.fonts)
    .pipe(debug())
    .pipe(gulp.dest(`${buildDir}/fonts/`));
});

gulp.task('app', () => {
  return gulp.src(paths.angular, {base: `${sourceDir}/js/`})
    .pipe(debug())
    .pipe(gulp.dest(`${buildDir}/js/`));
});

// Generate dev index.html
gulp.task('index', () => {
  
  let indexFiles = [
    buildDir + '/js/libs/*.js',
    buildDir + '/css/*.css',
    buildDir + '/less/*.less',
    buildDir + '/fonts/*',
  ];

  let appFiles = [
    buildDir + '/js/index.js',
    buildDir + '/js/**/*.js'
  ];

  let target = gulp.src(`${appDir}/index.html`).pipe(debug({title: 'target'}));
  let libSources = gulp.src(indexFiles, {read: false}).pipe(debug({title: 'libSources'}));
  let appSources = gulp.src(appFiles, {read: false}).pipe(debug({title: 'appSources'}));

  return target
    .pipe(inject(libSources, {ignorePath: buildDir, addRootSlash: false, name: 'libs'}))
    .pipe(debug({title: 'inject libSources'}))
    .pipe(inject(appSources, {ignorePath: buildDir, addRootSlash: false}))
    .pipe(gulp.dest(buildDir));
});

gulp.task('watch',  () => {
  return gulp.watch([`${appDir}/index.html`, paths.angular, paths.less], ['rebuild'], () => {
    gulp.src(sourceDir)
      .pipe(debug({title: 'Watch:'}))
      .pipe(gulp.dest(buildDir))
      .on('change', browserSync.reload);
  });
});

gulp.task('rebuild', (cb) => {
  runSequence('clean', [
    'libs',
    'css',
    'less',
    'fonts',
    'app'
  ], ['index'], cb);
});

gulp.task('dev', (cb) => {
  runSequence('clean', [
    'libs',
    'css',
    'less',
    'fonts',
    'app'
  ], ['index'], 'browser-sync', 'watch', cb);
});

gulp.task('default', (cb) => {
  runSequence('clean', [
    'libs',
    'css',
    'less',
    'fonts',
    'app'
  ], ['index'], cb);
});