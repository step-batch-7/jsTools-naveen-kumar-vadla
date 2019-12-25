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
	let options = ["-k", "1"];

	if (userOptions.includes("-k")) {
		const optKIdx = userOptions.indexOf("-k");
		options = userOptions.splice(optKIdx, 2);
	}

	return { fileNames: userOptions.slice(), options, delimiter: " " };
};

const performSortOperation = (userArgs, fsUtils) => {
	const { readFileSync, existsSync } = fsUtils;
	const { fileNames, options, delimiter } = parseUserOptions(userArgs);
	const result = { sortedData: "", error: "" };

	if (isNaN(+options[1]) || !(options[1] > 0)) {
		result.error = `sort: -k ${options[1]}: Invalid argument`;
		return result;
	}

	if (!existsSync(fileNames[0])) {
		result.error = `sort: No such file or directory`;
		return result;
	}

	const content = readFileSync(fileNames[0], "utf-8").split("\n");
	result.sortedData = sortContent({ options, content, delimiter }).join("\n");
	return result;
};

module.exports = {
	sortContent,
	formatContent,
	parseUserOptions,
	performSortOperation
};
