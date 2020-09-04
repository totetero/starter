
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const main = {
	target: "electron-main",
	entry: path.resolve(__dirname, "./src/main/index.ts"),
	output: {
		path: path.resolve(__dirname, "./dist1"),
		filename: "main.js",
	},
	node: {
		__dirname: false,
		__filename: false
	},
	resolve: {
		extensions: [".js", ".ts",],
		alias: {
			"@main": path.resolve(__dirname, "./src/main"),
			"@renderer": path.resolve(__dirname, "./src/renderer"),
		},
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader",
		},],
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: "src/main/preload.js", },
		]),
	],
};

const renderer = {
	target: "electron-renderer",
	entry: path.resolve(__dirname, "./src/renderer/index.ts"),
	output: {
		path: path.resolve(__dirname, "./dist1"),
		filename: "renderer.js",
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx",],
		alias: {
			"@main": path.resolve(__dirname, "./src/main"),
			"@renderer": path.resolve(__dirname, "./src/renderer"),
		},
	},
	module: {
		rules: [{
			test: /\.(ts|tsx)$/,
			loader: "ts-loader",
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/renderer/index.html"),
		}),
	],
};

module.exports = [main, renderer,];

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

