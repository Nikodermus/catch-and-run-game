module.exports = {
	entry: './app/javascripts/game_engine.js',
	output: {
		filename: './assets/javascripts/bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		}]
	}
};