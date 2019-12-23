"use strict";

const fs = require("fs");

const readFromFile = function(filepath) {
	return fs.readFileSync(filepath, "utf8");
};

const writeIntoFile = function(filepath, data) {
	fs.writeFileSync(filepath, data);
};

const isFilePresent = function(filepath) {
	return fs.existsSync(filepath);
};

module.exports = { isFilePresent, readFromFile, writeIntoFile };
