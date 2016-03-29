// karma config file - project - test AngularJs
module.exports = function(config) {
	config.set({
		frameworks: ['jasmine', 'phantomjs-shim'],
		files: [
			'app/public/bower/angular/angular.js',
			'app/public/bower/angular-mocks/angular-mocks.js',
			"app/public/bower/angular-messages/angular-messages.min.js",
			"app/public/bower/angular-resource/angular-resource.min.js",
			"app/public/bower/angular-ui-router/release/angular-ui-router.min.js",
			"app/public/bower/angular-bootstrap/ui-bootstrap-tpls.min.js",
			"app/public/bower/angular-sanitize/angular-sanitize.min.js",
			"app/public/bower/angular-ui-grid/ui-grid.js",
			"app/public/bower/ui-select/dist/select.min.js",
			"app/public/bower/angular-toastr/dist/angular-toastr.tpls.js",
			"app/public/bower/spin.js/spin.js",
			"app/public/bower/angular-spinner/angular-spinner.js",

			// module declarations
			'app/*.js',
			'app/common/services/remote-services.js',
			'app/**/config.js',
			// modules
			'app/common/**/*.js',
			'app/VaR-and-sVaR/*.js',
			'app/comprehensive-PnL/*.js',
			'app/inventory-turnover/*.js',
			'app/risk-factor-sensitivities/*.js',
			'app/risk-position-limits-usage/*.js',
			'app/inventory-aging/*.js',
			'app/table-of-content/*.js',
			'app/review-status/*.js',
			// ----------------test specs---------------
			'app/test/spec/**/*.spec.js'
		],
		exclude: ['app/common/services/remote-services-mod.js'],
		// plugins: [
		// 	'karma-phantomjs-launcher',
		// 	'karma-jasmine',
		// 	'karma-coverage'
		// ],
		// start these browsers
		browsers: ['PhantomJS'],
		reporters: ['progress', 'coverage'],
		preprocessors: {
			'app/common/**/*.js': ['coverage'],
			'app/VaR-and-sVaR/*.js': ['coverage'],
			'app/comprehensive-PnL/*.js': ['coverage'],
			'app/inventory-turnover/*.js': ['coverage'],
			'app/risk-factor-sensitivities/*.js': ['coverage'],
			'app/risk-position-limits-usage/*.js': ['coverage'],
			'app/inventory-aging/*.js': ['coverage'],
			'app/table-of-content/*.js': ['coverage']
		},
		junitReporter: {
		  outputFile: 'test-results.xml'
		},
		coverageReporter: {
			type: 'html',
			dir: 'coverage'
		},
		logLevel: config.LOG_INFO,
		singleRun: false,
		color: true,
		port:9876,
		 // to avoid random DISCONNECTED messages https://github.com/karma-runner/karma/issues/598#issuecomment-77105719
		browserDisconnectTimeout : 10000, // default 2000
		browserDisconnectTolerance : 1, // default 0
		browserNoActivityTimeout : 60000, //default 10000
	});
};