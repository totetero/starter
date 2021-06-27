
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

module.exports = {
	mode: "development",
	entry: path.resolve(__dirname, "./src/main01Gray.ts"),
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
			loader: "ts-loader"
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: path.join(__dirname, "src/index.html"), }),
		new CopyWebpackPlugin({ patterns: [
			{ from: "src/opencv.js", },
			{ from: "src/haarcascade_frontalface_default.xml", },
			{ from: "src/haarcascade_eye.xml", },
		], }),
	],
	devServer: {
		contentBase: "./dist",
		inline: true,
		port: 8080,
		host:"0.0.0.0",
		https: {
			key: fs.readFileSync("dist/ssl_fuhaha_starter_opencv_js.key"),
			cert: fs.readFileSync("dist/ssl_fuhaha_starter_opencv_js.crt"),
		},
	},
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
