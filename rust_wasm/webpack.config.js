const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

module.exports = {
	mode: "development",
	entry: path.resolve(__dirname, "./src/Main.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		publicPath: "/",
		filename: "index.js?[hash]",
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".wasm",],
	},
	module: {
		rules: [{
			test: /\.(ts|tsx)$/,
			loader: "ts-loader"
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/index.html"),
		}),
		new WasmPackPlugin({
			crateDirectory: path.join(__dirname, "crate")
		}),
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
