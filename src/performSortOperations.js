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
		const error = generateErrorMessage({
			cmd: `sort`,
			msg: `No such file or directory`
		});
		return { error: error };
	}
	const fileContent = readFromFile(fileName).split("\n");
	const fileContentWithOptions = { options, fileContent, delimiter };
	const sortedData = sortContent(fileContentWithOptions);
	return { sortedData: sortedData.join("\n") };
};

module.exports = { performSortOperations };
