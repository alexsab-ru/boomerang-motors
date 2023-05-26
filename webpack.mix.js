let mix = require('laravel-mix');

require('laravel-mix-serve');

mix.autoload({
	jquery: ['$', 'jQuery', 'window.jQuery'],
});

mix
	.js('js/service-common.js', 'js/scripts.min.js')
	.sass('sass/service-style.sass', 'css/styles.css')
	.setPublicPath('/')
	.serve('php -S 127.0.0.1:8080 -t ./', {
		verbose: true,
		watch: true,
		dev: true,
	});

if (mix.inProduction()) {
	mix.version();
} else {
	mix.sourceMaps().webpackConfig({ devtool: 'inline-source-map' });
	mix.browserSync({
		proxy: '127.0.0.1:8080',
		files: ['**.html', '**/*.php', 'css/styles.css', 'js/scripts.min.js'],
		// server: { baseDir: "./", },
		notify: false
	});
}

mix.disableSuccessNotifications();