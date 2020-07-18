const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

module.exports = {
	mode: "development",
	entry: path.resolve(__dirname, "./src/Main.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		publicPath: "/",
		filename: "index.js",
	},
	resolve: {
		extensions: [".js", ".ts",],
	},
	module: {
		rules: [
			{ test: /\.ts$/, loader: "ts-loader", },
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader", },
		],
	},
	plugins: [
		new CopyWebpackPlugin([
			{ context: "src", from: "**/*.html" },
			{ context: "src", from: "**/*.css" },
		]),
	],
	devServer: {
		contentBase: "./dist",
		inline: true,
		port: 8080,
		host:"0.0.0.0",
	},
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
