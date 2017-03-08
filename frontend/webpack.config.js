const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');


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
		new BabiliPlugin(),
	],
	module: {
		loaders: [
			{
				test: /(\.scss)|(\.css)$/,
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
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, 'jsx'),
				],
				test: /\.jsx$/,
				query: {
					plugins: [
						'transform-runtime',
						'transform-object-rest-spread',
					],
					presets: [
						'es2015',
						'react',
					],
				},
			},
			{
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, 'js'),
				],
				test: /\.js$/,
				query: {
					presets: [
						'es2015',
					],
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
			'.css',
			'.scss',
			'.js',
			'.jsx',
		],
	},
};
