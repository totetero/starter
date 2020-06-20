const path = require("path");
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const client = {
	mode: "development",
	entry: path.resolve(__dirname, "./src/client/Main.ts"),
	output: {
		path: path.resolve(__dirname, "./dist/public"),
		publicPath: "/",
		filename: "index.js?[hash]",
	},
	resolve: {
		extensions: [".js", ".ts",],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader"
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/client/index.html"),
		}),
		new CopyWebpackPlugin([
			{ from: 'src/client/test.txt' },
		]),
	],
};

const server = {
	mode: "development",
	target: "node",
	externals: [nodeExternals()],
	entry: path.resolve(__dirname, "./src/server/Main.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		publicPath: "/",
		filename: "main.js",
	},
	resolve: {
		extensions: [".js", ".ts",],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader"
		},],
	},
};


module.exports = [client, server];

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
