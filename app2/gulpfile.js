var gulp  = require('gulp');
var debug = require('gulp-debug');
// var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var Server = require('karma').Server;
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var del = require('del');
var minifyHtml = require('gulp-minify-html');
var angularTemplatecache = require('gulp-angular-templatecache');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var ngAnnotate = require('gulp-ng-annotate');
var tasksListing = require('gulp-task-listing');
var replace = require('gulp-replace');
var argv = require('yargs').argv;

var config = require('./gulp.config')();

gulp.task('help', tasksListing);
gulp.task('default', ['help']);

gulp.task('dev', ['serve', 'watch']);

gulp.task('reload', function () {
	browserSync.reload();
});

//Server with live reloading and Sass compilation
gulp.task('watch', function () {
	var appJsAndTemplates = [].concat(config.jsFiles, config.htmlFiles);
	gulp.watch(appJsAndTemplates, {}, ['reload', 'vet']);
	// compileSass();
});

// Static server, does not watch file changes
gulp.task('serve', function() {
	browserSync.init({
		server: {
			//baseDir: 'app'
		},
		port: 12345
	});
});

// Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
// 	return gulp.src(config.sassFiles)
// 		.pipe(sass())
// 		.on('error', sass.logError)
// 		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
// 		.pipe(gulp.dest(config.cssDest))
// 		.pipe(browserSync.stream());
// });

// // Sass compilation on *.scss files change
// gulp.task('sass-watcher', function () {
// 	compileSass();
// });

//--------------------- Single run unit test--------------------
gulp.task('test', [], function(done) {
	new Server({
	  configFile: __dirname + '/karma.conf.js',
	  singleRun: true
	}, karmaComplete).start();

	function karmaComplete(result) {
	  if (result === 1) {
	  	console.log('test failed');
	  	console.log('removing the dist/ folder...');
	  	del(config.dist).then(function () {
	  		console.log('removed all dist/ files');
	  	});
	  	console.log('removing all modified files...');
	  	del(config.modifiedfiles).then(function () {
	  		console.log('removed all modified files');
	  	});
	    done('Unit test failed, Cannot proceed with the build ' + result);
	  } else {
	    done();
	  }
	}
});

//--------------------- Continuous unit test
gulp.task('continuous-test', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js'
	}, done).start();
});

//--------------------- re-run unit tests on *.js and *.spec.js change
gulp.task('watch-test', function () {
	gulp.watch(['app/test/spec/**/*.spec.js'], ['continuous-test']);
});

gulp.task('vet', function () {
	return gulp.src(config.jsFiles)
		.pipe(gulpif(argv.verbose, debug()))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'), {verbose: true})
		.pipe(jshint.reporter('fail'))
		// .pipe(jscs()) //Comment out this and next two lines if you don't want JSCS validation
		// .pipe(jscs.reporter())
		// .pipe(jscs.reporter('fail'))
});

// ---------------------build (* = local | uat | prod )-----------------------
	// build-*
		// copy-mock-data
		// inject-useref-*
			// test
			// cache-template
				// clean-template
			// env-*
			// clean-styles
			// clean-js
			// clean-html
		// copy-mock-data
			// clean-json
		// copy-images
			// clean-images
		// copy-fonts
			// copy-uiGrid-fonts
				// clean-fonts

gulp.task('build-local', ['inject-useref-local', 'copy-mock-data', 'copy-images', 'copy-fonts'], function (done) {
	console.log('removing modified files...');
	del(config.modifiedfiles).then(function () {
		console.log('removed modified files');
	});
	console.log('local build success');
});

gulp.task('inject-useref-local', ['env-local', 'cache-template', 'clean-styles', 'clean-js', 'clean-html'], function () {
	var templateCache = './' + config.dist + config.templateDir + config.templateCache.file;
	return gulp.src(config.index)
		.pipe(inject(
						gulp.src('app/common/services/remote-services-mod.js',
							{read: false}), {
						starttag: '<!-- inject:remote-services-mod:js -->',
						ignorePath: 'app/',
						addRootSlash: false
					})
			)
		.pipe(inject(gulp.src(templateCache, {read: false}), {
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(useref())
		.pipe(gulpif('**/app.min.js', ngAnnotate())) //apply to custom application code ONLY, injects dependencies for us in case the injections are missing. So when we uglify in the next step, Angular can reference the correct Dependencies without causing error
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('!**/index.html', rev()))
		.pipe(revReplace())
		.pipe(gulp.dest(config.dist));
});

gulp.task('build-uat', ['inject-useref-uat', 'copy-images', 'copy-fonts'], function (done) {
	console.log('removing modified files...');
	del(config.modifiedfiles).then(function () {
		console.log('removed modified files');
	});
	del(config.dist + '/data').then(function () {
		console.log('removed mock data folder');
	});
	console.log('UAT build success');
	
});

gulp.task('inject-useref-uat', ['test', 'env-uat', 'cache-template', 'clean-styles', 'clean-js', 'clean-html'], function () {
	var templateCache = './' + config.dist + config.templateDir + config.templateCache.file;
	return gulp.src(config.index)
		.pipe(inject(
						gulp.src('app/common/services/remote-services-mod.js',
							{read: false}), {
						starttag: '<!-- inject:remote-services-mod:js -->',
						ignorePath: 'app/',
						addRootSlash: false
					})
			)
		.pipe(inject(gulp.src(templateCache, {read: false}), {
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(useref())
		.pipe(gulpif('**/app.min.js', ngAnnotate())) //apply to custom application code ONLY, injects dependencies for us in case the injections are missing. So when we uglify in the next step, Angular can reference the correct Dependencies without causing error
		.pipe(gulpif('**/app.min.js', uglify({mangle: true}))) //minify application code ONLY and mangles the variable names.
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('!**/index.html', rev()))
		.pipe(revReplace())
		.pipe(gulp.dest(config.dist));
});

gulp.task('build-prod', ['inject-useref-prod', 'copy-images', 'copy-fonts'], function (done) {
	console.log('removing modified files...');
	del(config.modifiedfiles).then(function () {
		console.log('removed modified files');
	});
	del(config.dist + '/data').then(function () {
		console.log('removed mock data folder');
	});
	console.log('Production build success');
});

gulp.task('inject-useref-prod', ['test', 'env-prod', 'cache-template', 'clean-styles', 'clean-js', 'clean-html'], function () {
	var templateCache = './' + config.dist + config.templateDir + config.templateCache.file;
	return gulp.src(config.index)
		.pipe(inject(
						gulp.src('app/common/services/remote-services-mod.js',
							{read: false}), {
						starttag: '<!-- inject:remote-services-mod:js -->',
						ignorePath: 'app/',
						addRootSlash: false
					})
			)
		.pipe(inject(gulp.src(templateCache, {read: false}), {
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(useref())
		.pipe(gulpif('**/app.min.js', ngAnnotate())) //apply to custom application code ONLY, injects dependencies for us in case the injections are missing. So when we uglify in the next step, Angular can reference the correct Dependencies without causing error
		.pipe(gulpif('**/app.min.js', uglify({mangle: true}))) //minify application code ONLY and mangles the variable names.
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('!**/index.html', rev()))
		.pipe(revReplace())
		.pipe(gulp.dest(config.dist));
});

// --------------------replace source content-----------------------
// run this to change the environment variable: local | uat | prod
// in app/common/services/remote-services.js
gulp.task('env-local', [], function () {
	gulp.src(config.endpointJsFile)
		.pipe(replace(/var env(.*);/, 'var env = \"' + 'local' + '\"; console.log(\'Local Build\');'))
		.pipe(rename('remote-services-mod.js'))
		.pipe(gulp.dest('app/common/services'))
});

gulp.task('env-uat', [], function () {
	gulp.src(config.endpointJsFile)
		.pipe(replace(/var env(.*);/, 'var env = \"' + 'uat' + '\"; console.log(\'UAT Build\');'))
		.pipe(rename('remote-services-mod.js'))
		.pipe(gulp.dest('app/common/services'))
});

gulp.task('env-prod', [], function () {
	gulp.src(config.endpointJsFile)
		.pipe(replace(/var env(.*);/, 'var env = \"' + 'prod' + '\"; console.log(\'Production Build\');'))
		.pipe(rename('remote-services-mod.js'))
		.pipe(gulp.dest('app/common/services'))
});

// --------------------Angular template cache-----------------------
gulp.task('cache-template', ['clean-template'], function() {
	// Concatenates and registers AngularJS templates in the $templateCache.
	return gulp.src(config.angularTemplates)
		.pipe(minifyHtml({empty: true}))
		.pipe(angularTemplatecache(config.templateCache.file, config.templateCache.options))
		.pipe(gulp.dest(config.dist + config.templateDir));
});
//---------------------Copy mock json folder to dist-----------------
gulp.task('copy-mock-data', ['clean-json'], function(done) {
	return gulp.src(config.mockJson)
		.pipe(debug())
		.pipe(gulp.dest(config.dist + 'data'));
});

gulp.task('copy-images', ['clean-images'], function() {
	return (gulp.src(config.images))
		.pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('copy-fonts', ['copy-uiGrid-fonts'], function() {
	return (gulp.src(config.fontsDir))
		// .pipe(debug())
		.pipe(rename({dirname: ''})) //remove folder structure
		.pipe(gulp.dest(config.dist + 'fonts'));
});

gulp.task('copy-uiGrid-fonts', ['clean-fonts'], function() {
	return (gulp.src(config.uiGridFonts))
		// .pipe(debug())
		.pipe(rename({dirname: ''})) //remove folder structure
		.pipe(gulp.dest(config.dist + 'css'));
});

//-------------------------Clean up tasks, clean out previous build-----------------------------
gulp.task('clean-styles', function(done) {
  var files = config.dist + 'css/*.css';
  clean(files, done);
});
gulp.task('clean-js', ['clean-modified-files'], function(done) {
  var files = config.dist + 'js/*.js';
  clean(files, done);
});

gulp.task('clean-modified-files', [], function(done) {
  clean(config.modifiedfiles, done);
});

gulp.task('clean-html', function(done) {
  var files = config.dist + '**/*.html';
  clean(files, done);
});

gulp.task('clean-images', function(done) {
  var files = config.dist+ 'images/**/*.*';
  clean(files, done);
});
gulp.task('clean-json', function(done) {
	var files = [config.dist + 'data/**/*.json'];
	clean(files, done);
});
gulp.task('clean-code', function(done) {
	var files = [config.dist + '**/*.js', config.dist + '**/*.css',
		config.dist + '**/*.html'];
		clean(files, done);
});
gulp.task('clean-template', function(done) {
	var files = [config.dist + config.templateDir + '**/*.js'];
	clean(files, done);
});
gulp.task('clean-fonts', function(done) {
  var files = config.distFontsDir;
  clean(files, done);
});

// -------------------------helpers-----------------------------------------

function clean(path, done) {
	del(path).then(done());
}

// function compileSass () {
// 	gulp.watch(config.sassFiles, ['sass'], browserSync.reload);
// }