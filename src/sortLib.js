"use strict";

const sortContent = fileContentWithOptions => {
	let sortedContent = [];
	const { options, fileContent, delimiter } = fileContentWithOptions;
	if (!options.includes("-k")) {
		return sortedContent;
	}
	const formattedContent = formatFileContent(fileContent, delimiter, options);
	const keys = Object.keys(formattedContent);
	keys.sort();

	keys.forEach(key => {
		sortedContent.push(...formattedContent[key].sort());
	});

	return sortedContent;
};

const formatFileContent = (fileContent, delimiter, options) => {
	const formattedContent = {};
	fileContent.forEach(line => {
		const allKeys = Object.keys(formattedContent);
		const key = line.split(delimiter)[options[1] - 1];
		if (allKeys.includes(key)) {
			formattedContent[key].push(line);
		} else {
			formattedContent[key] = [line];
		}
	});
	return formattedContent;
};

const parseUserOptions = userOptions => {
	const fileName = userOptions[userOptions.length - 1];
	const optionKIndex = userOptions.indexOf("-k");
	const options = userOptions.slice(optionKIndex, optionKIndex + 2);
	const delimiter = " ";
	return { fileName, options, delimiter };
};

const generateErrorMessage = error => {
	return `${error.cmd}: ${error.msg}`;
};

module.exports = {
	sortContent,
	formatFileContent,
	parseUserOptions,
	generateErrorMessage
};
