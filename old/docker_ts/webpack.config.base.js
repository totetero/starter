
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

module.exports = {
	entry: path.resolve(__dirname, "./src/main.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "index.js?[hash]",
	},
	resolve: {
		extensions: [".js", ".ts",],
		alias: { "@": path.resolve(__dirname, "src"), },
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader",
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: path.join(__dirname, "src/index.html"), }),
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

