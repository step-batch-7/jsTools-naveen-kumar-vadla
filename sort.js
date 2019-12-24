"use strict";

const { stdout, stderr } = require("process");

const { performSortOperation } = require("./src/sortLib");
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
	const result = performSortOperation(argsObjecs);
	result.sortedData && stdout.write(result.sortedData);
	result.error && stderr.write(result.error);
};

main(process.argv.slice(2));
