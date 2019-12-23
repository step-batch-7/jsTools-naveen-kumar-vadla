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
	const delimiter = userOptions[-1] || " ";
	return { fileName, options, delimiter };
};

const performAction = args => {
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
	return sortedData;
};

const generateErrorMessage = error => {
	const cmd = error.cmd;
	const msg = error.msg;
	return [`${cmd}: ${msg}`];
};

module.exports = {
	sortContent,
	formatFileContent,
	parseUserOptions,
	performAction
};
