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
	try {
		const sortedData = performSortOperations(argsObjecs);
		stdout.write(sortedData);
	} catch (e) {
		stderr.write(e);
	}
};

main(process.argv.slice(2));
