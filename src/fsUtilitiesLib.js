"use strict";

const fs = require("fs");

const readFromFile = (filepath, encoding) => {
	return fs.readFileSync(filepath, encoding);
};

const writeIntoFile = (filepath, data) => {
	fs.writeFileSync(filepath, data, encoding);
};

const isFilePresent = filepath => {
	return fs.existsSync(filepath);
};

module.exports = { isFilePresent, readFromFile, writeIntoFile };
