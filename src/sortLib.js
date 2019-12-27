"use strict";

const getRequiredField = (line, delimiter, columnNumber) => {
	return line.split(delimiter)[columnNumber];
};

const sortByFields = (delimiter, columnNumber, line1, line2) => {
	if (columnNumber > line1.split(delimiter).length) columnNumber = 0;
	let line1Field = getRequiredField(line1, delimiter, columnNumber);
	let line2Field = getRequiredField(line2, delimiter, columnNumber);
	if (line1Field < line2Field) return -1;
	if (line1Field > line2Field) return 1;
	return 0;
};

const sortLines = (lines, columnNumber, delimiter) => {
	lines.sort(sortByFields.bind(null, delimiter, columnNumber - 1));
	return lines;
};

const parseUserArgs = userArgs => {
	const [, columnNumber, fileName] = userArgs;
	return { columnNumber, fileName, delimiter: " " };
};

const isPositiveInteger = num => Number.isInteger(+num) && +num > 0;

const sort = (userArgs, fs) => {
	const { fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
	let error = "";
	let sortedLines = "";
	if (!isPositiveInteger(columnNumber))
		return { error: `sort: -k ${columnNumber}: Invalid argument`, sortedLines };
	if (!fs.existsSync(fileName))
		return { error: `sort: No such file or directory`, sortedLines };
	const lines = fs.readFileSync(fileName, "utf-8").split("\n");
	sortedLines = sortLines(lines, columnNumber, delimiter).join("\n");
	return { sortedLines, error };
};

module.exports = {
	sortLines,
	parseUserArgs,
	sort,
	isPositiveInteger,
	sortByFields
};
