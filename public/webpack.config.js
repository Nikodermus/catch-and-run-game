	module.exports = {
		entry: {
			bundle: './app/javascripts/game_engine.js',
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/assets/javascripts/'
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