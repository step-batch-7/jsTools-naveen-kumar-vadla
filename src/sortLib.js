"use strict";

const fs = require("fs");

const sortContent = fileContentWithOptions => {
	let sortedContent = [];
	const options = fileContentWithOptions.options;
	const fileContent = fileContentWithOptions.content;
	const delimiter = fileContentWithOptions.delimiter || " ";
	if (!options.includes("-k")) {
		return sortedContent;
	}
	let { formattedContent, keys } = formatFileContent(
		fileContent,
		delimiter,
		options
	);

	keys = keys.sort();

	for (let index = 0; index < keys.length; index++) {
		sortedContent.push(formattedContent[keys[index]]);
	}

	return sortedContent;
};

const formatFileContent = (fileContent, delimiter, options) => {
	let formattedContent = {};
	const keys = fileContent.map(line => {
		const array = line.split(delimiter);
		return array[options[1] - 1];
	});
	fileContent.forEach((line, i) => {
		formattedContent[keys[i]] = line;
	});
	return { formattedContent, keys };
};

const parseUserOptions = userOptions => {
	const fileName = userOptions[userOptions.length - 1];
	const options = userOptions.slice(0, -1);
	return { fileName, options };
};

const performAction = userArgs => {
	const { fileName, options } = parseUserOptions(userArgs);
	const content = fs.readFileSync(fileName, "utf-8").split("\n");
	const sortedData = sortContent({ options: options, content: content });
	return sortedData;
};

module.exports = {
	sortContent,
	formatFileContent,
	parseUserOptions,
	performAction
};
