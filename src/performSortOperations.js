"use strict";

const {
	sortContent,
	parseUserOptions,
	generateErrorMessage
} = require("./sortLib");

const performSortOperations = args => {
	const { userArgs, readFromFile, isFilePresent } = args;
	const { fileName, options, delimiter } = parseUserOptions(userArgs);
	if (!isFilePresent(fileName)) {
		return generateErrorMessage({
			cmd: `sort`,
			msg: `No such file or directory`
		});
	}
	const fileContent = readFromFile(fileName).split("\n");
	const fileContentWithOptions = { options, fileContent, delimiter };
	const sortedData = sortContent(fileContentWithOptions);
	return sortedData.join("\n");
};

module.exports = { performSortOperations };
