"use strict";

const sortByFields = (delimiter, columnNumber, line1, line2) => {
	const line1Field = line1.split(delimiter)[columnNumber];
	const line2Field = line2.split(delimiter)[columnNumber];
	if (line1Field < line2Field) return -1;
	if (line1Field > line2Field) return 1;
	return 0;
};

const isColumnPresent = (columnNumber, line, delimiter) =>
	columnNumber <= line.split(delimiter).length;

const sortLines = (lines, columnNumber, delimiter) => {
	if (!isColumnPresent(columnNumber, lines[0], delimiter)) return lines.sort();
	lines.sort(sortByFields.bind(null, delimiter, columnNumber - 1));
	return lines;
};

const parseUserArgs = userArgs => {
	const [, columnNumber, fileName] = userArgs;
	return { columnNumber, fileName, delimiter: " " };
};

const isPositiveNumber = num => Number.isInteger(+num) && +num > 0;

const sort = (userArgs, fileSystem) => {
	const { readFileSync, existsSync } = fileSystem;
	const { fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
	let error = "";
	let sortedLines = "";
	if (!isPositiveNumber(columnNumber))
		return { error: `sort: -k ${columnNumber}: Invalid argument`, sortedLines };
	if (!existsSync(fileName)) return { error: `sort: No such file or directory`, sortedLines };
	const lines = readFileSync(fileName, "utf-8").split("\n");
	sortedLines = sortLines(lines, columnNumber, delimiter).join("\n");
	return { sortedLines, error };
};

module.exports = {
	sortLines,
	parseUserArgs,
	sort,
	isPositiveNumber,
	isColumnPresent,
	sortByFields
};
