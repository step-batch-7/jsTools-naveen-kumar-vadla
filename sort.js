"use strict";

const { stdout, stderr } = require("process");

const { performSortOperation } = require("./src/sortLib");
const {
	isFilePresent,
	readFromFile,
	writeIntoFile
} = require("./src/fsUtilitiesLib");

const main = userArgs => {
	const fsUtils = {
		isFilePresent,
		readFromFile,
		writeIntoFile
	};
	const result = performSortOperation(userArgs, fsUtils);
	stdout.write(result.sortedData);
	stderr.write(result.error);
};

main(process.argv.slice(2));
