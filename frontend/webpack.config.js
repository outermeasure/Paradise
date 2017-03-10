const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const assetsPluginInstance = new AssetsPlugin({
	filename: 'assets.json',
	fullPath: true,
	path: path.join(__dirname, '../'),
	update: false,
});

const extractStyles = new ExtractTextPlugin({
	filename: "styles.[contenthash].css",
	disable: false,
});

module.exports = {
	devtool: 'source-map',
	entry: {
		async_js: './async_js.jsx',
		inline_sync_js_top: './inline_sync_js_top.js',
	},
	output: {
		path: path.join(__dirname, '../public/'),
		filename: '[name].[chunkhash].bundle.js',
	},
	plugins: [
		new WebpackMd5Hash(),
		assetsPluginInstance,
		extractStyles,
		new CleanWebpackPlugin(
			[
				'./public/',
			],
			{
				root: path.join(__dirname, '../'),
				verbose: true,
				dry: false,
				exclude: [],
			}
		),
	],
	module: {
		loaders: [
			{
				test: /\.s?css$/,
				include: [
					path.resolve(__dirname, 'styles'),
				],
				loader: extractStyles.extract(
					{
						use: [
							{
								loader: "css-loader",
							},
							{
								loader: "sass-loader",
							},
						],
					}
				),
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, './'),
				],
				query: {
					plugins: [
						'transform-object-rest-spread',
						'transform-object-assign',
					],
					presets: [
						'es2015',
						'react',
					],
					env: {
						production: {
							presets: [
								"babili",
							],
						},
					},
				},
			},
			{
				loader: "file-loader?name=[name].[hash].[ext]",
				test: /\.(jpe?g|gif|png|svg|woff|eot|woff2|ttf|wav|mp3)$/,
			},
		],
	},
	resolve: {
		extensions: [
			'.eot',
			'.svg',
			'.ttf',
			'.woff',
			'.woff2',
			'.scss',
			'.css',
			'.jsx',
			'.js',
		],
	},
};
