module.exports = function () {
	
	var config = {
		index: 'app/index.html',
		cssDest: 'app/public/assets/css',
		sassFiles: [
			'app/public/assets/sass/*.scss',
			// "!app/public/assets/sass/_*.scss"
		],
		endpointJsFile: 'app/common/services/remote-services.js',
		cssFiles: 'app/public/assets/css/*.css',
		cssLibraries: [],
		jsDependencies: [
			'app/public/bower/angular/angular.min.js',
			"app/public/bower/angular-messages/angular-messages.min.js",
			"app/public/bower/angular-resource/angular-resource.min.js",
			"app/public/bower/angular-ui-router/release/angular-ui-router.min.js",
			"app/public/bower/angular-bootstrap/ui-bootstrap-tpls.min.js",
			"app/public/bower/angular-sanitize/angular-sanitize.min.js",
			"app/public/bower/angular-ui-grid/ui-grid.min.js",
			"app/public/bower/ui-select/dist/select.min.js",
			"app/public/bower/angular-toastr/dist/angular-toastr.tpls.min.js",
			"app/public/bower/spin.js/spin.js",
			"app/public/bower/angular-spinner/angular-spinner.min.js"
		],
		jsFiles: [
			'app/*.js',
			'app/common/**/*.js',
			'app/VaR-and-sVaR/*.js',
			'app/comprehensive-PnL/*.js',
			'app/inventory-turnover/*.js',
			'app/risk-factor-sensitivities/*.js',
			'app/risk-position-limits-usage/*.js',
			'app/inventory-aging/*.js',
			'app/table-of-content/*.js'
		],
		dist: 'dist/',
		templateDir: 'templates/',
		mockJson: [
			// 'app/data/*.json',
			'app/data/**/*.json'
		],
		htmlFiles: [
			'app/index.html',
			'app/**/*.html'
		],
		angularTemplates: [
			'app/**/*.html',
			'!app/index.html', //exclude index.html
			'!app/public/**/*.*' // exclude plugin library templates
		],
		templateCache: {
			file: 'templates.js',
			options: {
				module: 'app',
				standAlone: 'false'
			}
		},
		images: 'app/public/assets/images/**/*.*',
		fontsDir: [
			'app/public/bower/**/fonts/*.eot',
			'app/public/bower/**/fonts/*.woff',
			'app/public/bower/**/fonts/*.woff2',
			'app/public/bower/**/fonts/*.ttf',
			'app/public/bower/**/fonts/*.svg',
			'app/public/bower/**/fonts/*.otf'
		],
		uiGridFonts: [
			'app/public/bower/angular-ui-grid/*.woff',
			'app/public/bower/angular-ui-grid/*.eot',
			'app/public/bower/angular-ui-grid/*.woff2',
			'app/public/bower/angular-ui-grid/*.ttf',
			'app/public/bower/angular-ui-grid/*.svg',
			'app/public/bower/angular-ui-grid/*.otf'
		],
		distFontsDir: [
			'dist/fonts/*.eot',
			'dist/fonts/*.woff',
			'dist/fonts/*.woff2',
			'dist/fonts/*.ttf',
			'dist/fonts/*.svg',
			'dist/fonts/*.otf',
			'dist/css/*.eot',
			'dist/css/*.woff',
			'dist/css/*.woff2',
			'dist/css/*.ttf',
			'dist/css/*.svg',
			'dist/css/*.otf',
		],
		modifiedfiles: 'app/common/services/remote-services-mod.js'
	};

	return config;
};