"use strict";

const formatLines = function(delimiter, fieldValue, line) {
	const fields = Object.keys(this);
	const splittedLine = line.split(delimiter);
	const field = String(splittedLine[fieldValue]);
	if (!fields.includes(field)) this[field] = [line];
	else this[field].push(line);
};

const sortLines = (lines, options) => {
	const { fieldValue, delimiter } = options;
	const sortedLines = [];
	const formattedLines = {};
	lines.forEach(formatLines.bind(formattedLines, delimiter, fieldValue - 1));
	const fields = Object.keys(formattedLines).sort();
	fields.forEach(key => sortedLines.push(...formattedLines[key].sort()));
	return sortedLines;
};

const parseUserArgs = userArgs => {
	const [, fieldValue, fileName] = userArgs;
	return { fieldValue, fileName, delimiter: " " };
};

const sort = (userArgs, fileSystem) => {
	const { readFileSync, existsSync } = fileSystem;
	const { fileName, fieldValue, delimiter } = parseUserArgs(userArgs);
	let error = "";
	let sortedLines = "";
	if (isNaN(+fieldValue) || !(+fieldValue > 0))
		return { error: `sort: -k ${fieldValue}: Invalid argument`, sortedLines };
	if (!existsSync(fileName)) return { error: `sort: No such file or directory`, sortedLines };
	const lines = readFileSync(fileName, "utf-8").split("\n");
	sortedLines = sortLines(lines, { fieldValue, delimiter }).join("\n");
	return { sortedLines, error };
};

module.exports = {
	sortLines,
	parseUserArgs,
	sort
};
