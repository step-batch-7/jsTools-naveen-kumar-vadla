"use strict";

const formatFileContent = (content, delimiter, options) => {
	const formattedContent = {};

	content.map(line => {
		const allKeys = Object.keys(formattedContent);
		const splittedLine = line.split(delimiter);
		const key = String(splittedLine[options[1] - 1]);

		if (!allKeys.includes(key)) {
			formattedContent[key] = [line];
		} else {
			formattedContent[key].push(line);
		}
	});

	return formattedContent;
};

const sortContent = fileContentWithOptions => {
	const sortedContent = [];
	const { options, content, delimiter } = fileContentWithOptions;
	if (options.includes("-k")) {
		const formattedContent = formatFileContent(content, delimiter, options);
		const keys = Object.keys(formattedContent).sort();

		keys.map(key => {
			sortedContent.push(...formattedContent[key].sort());
		});
	}
	return sortedContent;
};

const parseUserOptions = userOptions => {
	const optKIdx = userOptions.indexOf("-k");
	const options = userOptions.splice(optKIdx, 2);
	const fileNames = userOptions.slice();
	const delimiter = " ";

	return { fileNames, options, delimiter };
};

const performSortOperation = argsObj => {
	const { userArgs, readFromFile, isFilePresent } = argsObj;
	const { fileNames, options, delimiter } = parseUserOptions(userArgs);

	if (isNaN(+options[1]) || !(options[1] > 0))
		return { error: `sort: -k ${options[1]}: Invalid argument` };

	if (!isFilePresent(fileNames[0]))
		return { error: `sort: No such file or directory` };

	const content = readFromFile(fileNames[0]).split("\n");
	const fileContentWithOptions = { options, content, delimiter };
	const sortedData = sortContent(fileContentWithOptions);

	return { sortedData: sortedData.join("\n") };
};

module.exports = {
	sortContent,
	formatFileContent,
	parseUserOptions,
	performSortOperation
};
