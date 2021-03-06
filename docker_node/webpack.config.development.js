const { merge, } = require('webpack-merge');
const base = require('./webpack.config.base.js');

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const client = {
	mode: "development",
};

const server = {
	mode: "development",
};

module.exports = [
	merge(base[0], client),
	merge(base[1], server),
];

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
