"use strict";

const fs = require("fs");

const readFromFile = function(filepath, encoding) {
	return fs.readFileSync(filepath, encoding);
};

const writeIntoFile = function(filepath, data) {
	fs.writeFileSync(filepath, data, encoding);
};

const isFilePresent = function(filepath) {
	return fs.existsSync(filepath);
};

module.exports = { isFilePresent, readFromFile, writeIntoFile };
