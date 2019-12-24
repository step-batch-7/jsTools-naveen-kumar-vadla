"use strict";

const { stdout, stderr } = require("process");

const { performSortOperations } = require("./src/sortLib");
const {
	isFilePresent,
	readFromFile,
	writeIntoFile
} = require("./src/fsUtilitiesLib");

const main = userArgs => {
	const argsObjecs = {
		userArgs,
		isFilePresent,
		readFromFile,
		writeIntoFile
	};
	const result = performSortOperations(argsObjecs);
	result.sortedData && stdout.write(result.sortedData);
	result.error && stderr.write(result.error);
};

main(process.argv.slice(2));
