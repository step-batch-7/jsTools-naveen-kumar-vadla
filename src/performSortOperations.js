"use strict";

const { sortContent, parseUserOptions } = require("./sortLib");

const performSortOperations = argsObj => {
	const { userArgs, readFromFile, isFilePresent } = argsObj;
	const { fileName, options, delimiter } = parseUserOptions(userArgs);

	if (isNaN(+options[1]) || !(options[1] > 0))
		return { error: `sort: -k ${options[1]}: Invalid argument` };
	if (!isFilePresent(fileName))
		return { error: `sort: No such file or directory` };

	const fileContent = readFromFile(fileName).split("\n");
	const fileContentWithOptions = { options, fileContent, delimiter };
	const sortedData = sortContent(fileContentWithOptions);

	return { sortedData: sortedData.join("\n") };
};

module.exports = { performSortOperations };
