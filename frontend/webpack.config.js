const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');

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

const devtoolProps = {};
if (process.env.NODE_ENV !== 'production') {
	devtoolProps.devtool = "source-map";
}
module.exports =
	Object.assign(
		{},
		devtoolProps,
		{
			entry: {
				async: './async.jsx',
				inline_sync_top: './inline_sync_top.js',
			},
			output: {
				path: path.join(__dirname, '../public/'),
				filename: '[name].[chunkhash].bundle.js',
			},
			plugins: [
				new WebpackMd5Hash(),
				assetsPluginInstance,
				extractStyles,
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
								'transform-class-properties',
							],
							presets: [
								'es2015',
								'stage-0',
								'react',
								'env',
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
						loader:
						"file-loader?name=[name].[hash].[ext]&publicPath=/public/",
						test:
						/\.(jpe?g|gif|png|svg|woff|eot|woff2|ttf|wav|mp3)$/,
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
		}
	);
