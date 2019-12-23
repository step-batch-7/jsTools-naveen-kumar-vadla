"use strict";

const { performAction } = require("./src/sortLib");
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
	const sortedData = performAction(argsObjecs);
	console.log(sortedData);
};

main(process.argv.slice(2));
