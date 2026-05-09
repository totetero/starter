const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const client = {
	entry: path.resolve(__dirname, "./src/client/index.ts"),
	output: {
		path: path.resolve(__dirname, "./dist/public"),
		publicPath: "/",
		filename: "index.js?[hash]",
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx",],
	},
	module: {
		rules: [{
			test: /\.(ts|tsx)$/,
			loader: "ts-loader",
			options: {
				configFile: "tsconfig.client.json",
			},
		}, {
			test: /\.(glsl|vs|fs|vert|frag)$/,
			exclude: /node_modules/,
			use: ["raw-loader", "glslify-loader"],
		},],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/client/index.html"),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "src/client/test.txt", },
			],
		}),
	],
};

const server = {
	target: "node",
	externals: [nodeExternals(),],
	entry: path.resolve(__dirname, "./src/server/index.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		publicPath: "/",
		filename: "index.js",
	},
	resolve: {
		extensions: [".js", ".ts",],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader",
			options: {
				configFile: "tsconfig.server.json",
			},
		},],
	},
};


module.exports = [client, server,];

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
