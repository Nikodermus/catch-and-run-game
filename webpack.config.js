module.exports = {
	entry: {
		bundle: './app/javascripts/game_engine.js',
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/assets/javascripts/'
	},
	cache: false,
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env'],
					minified: false
				}
			}
		}]
	},
	devServer: {
		compress: false,
		port: 9000
	}
};