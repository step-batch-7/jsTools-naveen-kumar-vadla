"use strict";

const sortByFields = (delimiter, columnNumber, line1, line2) => {
	const line1Field = line1.split(delimiter)[columnNumber];
	const line2Field = line2.split(delimiter)[columnNumber];
	if (line1Field < line2Field) return -1;
	if (line1Field > line2Field) return 1;
	return 0;
};

const sortLines = (lines, columnNumber, delimiter) => {
	if (columnNumber > lines[0].split(delimiter).length) return lines.sort();
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
