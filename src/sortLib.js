"use strict";

const formatContent = function(delimiter, field, line) {
	const allKeys = Object.keys(this);
	const splittedLine = line.split(delimiter);
	const key = String(splittedLine[field]);

	if (!allKeys.includes(key)) {
		this[key] = [line];
	} else {
		this[key].push(line);
	}
};

const sortContent = fileContentWithOptions => {
	const { options, content, delimiter } = fileContentWithOptions;
	const sortedContent = [];
	const formattedContent = {};

	content.map(formatContent.bind(formattedContent, delimiter, options[1] - 1));
	const keys = Object.keys(formattedContent).sort();

	keys.map(key => sortedContent.push(...formattedContent[key].sort()));

	return sortedContent;
};

const parseUserOptions = userOptions => {
	let options = [];
	if (userOptions.includes("-k")) {
		const optKIdx = userOptions.indexOf("-k");
		options = userOptions.splice(optKIdx, 2);
	}
	const fileNames = userOptions.slice();

	return { fileNames, options, delimiter: " " };
};

const performSortOperation = (userArgs, fsUtils) => {
	const { readFileSync, existsSync } = fsUtils;
	const { fileNames, options, delimiter } = parseUserOptions(userArgs);

	if (isNaN(+options[1]) || !(options[1] > 0))
		return {
			sortedData: "",
			error: `sort: -k ${options[1]}: Invalid argument`
		};

	if (!existsSync(fileNames[0]))
		return { sortedData: "", error: `sort: No such file or directory` };

	const content = readFileSync(fileNames[0], "utf-8").split("\n");
	const fileContentWithOptions = { options, content, delimiter };
	const sortedData = sortContent(fileContentWithOptions);

	return { sortedData: sortedData.join("\n"), error: "" };
};

module.exports = {
	sortContent,
	formatContent,
	parseUserOptions,
	performSortOperation
};
