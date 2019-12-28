"use strict";

const compareRows = function(row1, row2) {
	if (this.columnNumber > row1.length) this.columnNumber = 1;
	if (row1[this.columnNumber - 1] < row2[this.columnNumber - 1]) return -1;
	if (row1[this.columnNumber - 1] > row2[this.columnNumber - 1]) return 1;
	return 0;
};

const sortRows = (rows, columnNumber) => {
	rows.sort(compareRows.bind({ columnNumber }));
	return rows;
};

const parseUserArgs = userArgs => {
	const [, columnNumber, fileName] = userArgs;
	if (!isPositiveInteger(columnNumber))
		return { error: `sort: -k ${columnNumber}: Invalid argument` };
	return { columnNumber, fileName, delimiter: " ", error: "" };
};

const isPositiveInteger = num => Number.isInteger(+num) && +num > 0;

const sort = (userArgs, fs) => {
	let error = "";
	let sortedLines = "";
	const parsedUserArgs = parseUserArgs(userArgs);
	if (parsedUserArgs.error) return { error: parsedUserArgs.error, sortedLines };
	const { fileName, columnNumber, delimiter } = parsedUserArgs;
	if (!fs.existsSync(fileName))
		return { error: `sort: No such file or directory`, sortedLines };
	const lines = fs.readFileSync(fileName, "utf-8").split("\n");
	const rows = lines.map(line => line.split(delimiter));
	const sortedRows = sortRows(rows, columnNumber);
	sortedLines = sortedRows.map(row => row.join(delimiter));
	return { sortedLines: sortedLines.join("\n"), error };
};

module.exports = { sortRows, parseUserArgs, sort, isPositiveInteger };
