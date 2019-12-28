'use strict';

const compareRows = function(row1, row2) {
  const one = 1;
  const minusOne = -1;
  const zero = 0;
  if (this.columnNumber > row1.length) {
    this.columnNumber = one;
  }
  if (row1[this.columnNumber - one] < row2[this.columnNumber - one]) {
    return minusOne;
  }
  if (row1[this.columnNumber - one] > row2[this.columnNumber - one]) {
    return one;
  }
  return zero;
};

const sortRows = (rows, columnNumber) => {
  rows.sort(compareRows.bind({ columnNumber }));
  return rows;
};

const parseUserArgs = userArgs => {
  const [, columnNumber, fileName] = userArgs;
  if (!isPositiveInteger(columnNumber)) {
    return { error: `sort: -k ${columnNumber}: Invalid argument` };
  }
  return { columnNumber, fileName, delimiter: ' ', error: '' };
};

const isPositiveInteger = num => {
  const zero = 0;
  return Number.isInteger(+num) && +num > zero;
};

const sortOnFile = (fs, sortOptions) => {
  const { fileName, columnNumber, delimiter } = sortOptions;
  let sortedLines = '';
  if (!fs.existsSync(fileName)) {
    return { error: 'sort: No such file or directory', sortedLines };
  }
  const lines = fs.readFileSync(fileName, 'utf-8').split('\n');
  const rows = lines.map(line => line.split(delimiter));
  const sortedRows = sortRows(rows, columnNumber);
  sortedLines = sortedRows.map(row => row.join(delimiter));
  return { sortedLines, error: '' };
};

const sort = (userArgs, fs) => {
  const parsedUserArgs = parseUserArgs(userArgs);
  if (parsedUserArgs.error) {
    return { error: parsedUserArgs.error, sortedLines: '' };
  }
  const { fileName, columnNumber, delimiter } = parsedUserArgs;
  const sortedFileLines = sortOnFile(fs, { fileName, columnNumber, delimiter });
  if (sortedFileLines.error) {
    return { error: sortedFileLines.error, sortedLines: '' };
  }
  return { sortedLines: sortedFileLines.sortedLines.join('\n'), error: '' };
};

module.exports = { sortRows, parseUserArgs, sort, isPositiveInteger };
