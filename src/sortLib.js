'use strict';

const compareRows = function(columnNumber, row1, row2) {
  const one = 1;
  const minusOne = -1;
  const zero = 0;
  if (columnNumber > row1.length) {
    columnNumber = one;
  }
  if (row1[columnNumber - one] < row2[columnNumber - one]) {
    return minusOne;
  }
  if (row1[columnNumber - one] > row2[columnNumber - one]) {
    return one;
  }
  return zero;
};

const sortRows = (rows, columnNumber) => {
  rows.sort(compareRows.bind(null, columnNumber));
  return rows;
};

const isPositiveInteger = num => {
  const zero = 0;
  return Number.isInteger(+num) && +num > zero;
};

const parseUserArgs = userArgs => {
  const [, columnNumber, fileName] = userArgs;
  if (!isPositiveInteger(columnNumber)) {
    return { error: `sort: -k ${columnNumber}: Invalid argument` };
  }
  return { columnNumber, fileName, delimiter: ' ', error: '' };
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
