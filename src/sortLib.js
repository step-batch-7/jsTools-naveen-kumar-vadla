"use strict";

const formatLines = function(delimiter, columnNumber, line) {
	const keys = Object.keys(this);
	const columns = line.split(delimiter);
	const field = String(columns[columnNumber]);
	if (!keys.includes(field)) this[field] = [line];
	else this[field].push(line);
};

const sortLines = (lines, sortOptions) => {
	const { columnNumber, delimiter } = sortOptions;
	const sortedLines = [];
	const formattedLines = {};
	lines.forEach(formatLines.bind(formattedLines, delimiter, columnNumber - 1));
	const fields = Object.keys(formattedLines).sort();
	fields.forEach(field => sortedLines.push(...formattedLines[field].sort()));
	return sortedLines;
};

const parseUserArgs = userArgs => {
	const [, columnNumber, fileName] = userArgs;
	return { columnNumber, fileName, delimiter: " " };
};

const sort = (userArgs, fileSystem) => {
	const { readFileSync, existsSync } = fileSystem;
	const { fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
	let error = "";
	let sortedLines = "";
	if (isNaN(+columnNumber) || !(+columnNumber > 0))
		return { error: `sort: -k ${columnNumber}: Invalid argument`, sortedLines };
	if (!existsSync(fileName)) return { error: `sort: No such file or directory`, sortedLines };
	const lines = readFileSync(fileName, "utf-8").split("\n");
	sortedLines = sortLines(lines, { columnNumber, delimiter }).join("\n");
	return { sortedLines, error };
};

module.exports = {
	sortLines,
	parseUserArgs,
	sort
};
