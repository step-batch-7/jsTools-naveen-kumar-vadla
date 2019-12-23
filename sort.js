"use strict";

const { performSortOperations } = require("./src/performSortOperations");
const {
	isFilePresent,
	readFromFile,
	writeIntoFile
} = require("./src/utilitiesLib");

const main = userArgs => {
	const argsObjecs = {
		userArgs,
		isFilePresent,
		readFromFile,
		writeIntoFile
	};
	const sortedData = performSortOperations(argsObjecs);
	console.log(sortedData);
};

main(process.argv.slice(2));
