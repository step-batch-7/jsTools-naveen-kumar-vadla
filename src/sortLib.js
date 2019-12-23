"use strict";

const sortByFields = fileContentWithOptions => {
	const { options, fileContent, delimiter } = fileContentWithOptions;
	const sortedContent = [];

	const formattedContent = formatFileContent(fileContent, delimiter, options);
	const keys = Object.keys(formattedContent).sort();

	keys.forEach(key => {
		sortedContent.push(...formattedContent[key].sort());
	});

	return sortedContent;
};

const formatFileContent = (fileContent, delimiter, options) => {
	const formattedContent = {};

	fileContent.forEach(line => {
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
	let sortedContent = [];
	const { options } = fileContentWithOptions;
	if (options.includes("-k")) {
		sortedContent = sortByFields(fileContentWithOptions);
	}
	return sortedContent;
};

const parseUserOptions = userOptions => {
	const optKIdx = userOptions.indexOf("-k");
	const options = userOptions.splice(optKIdx, 2);
	const fileName = userOptions[userOptions.length - 1];
	const delimiter = " ";
	return { fileName, options, delimiter };
};

module.exports = {
	sortContent,
	formatFileContent,
	parseUserOptions,
	sortByFields
};
