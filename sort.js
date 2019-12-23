"use strict";

const { stdout, stderr } = require("process");

const { performSortOperations } = require("./src/performSortOperations");
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
	const sortedData = performSortOperations(argsObjecs);
	stdout.write(sortedData);
};

main(process.argv.slice(2));
