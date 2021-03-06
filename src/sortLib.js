'use strict';

class Sort {
  constructor(parsedUserArgs) {
    this.columnNumber = parsedUserArgs.columnNumber;
    this.delimiter = parsedUserArgs.delimiter;
    this.fileName = parsedUserArgs.fileName;
  }
  compareRows(row1, row2) {
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
  }
  sortLines(content) {
    const lines = content.replace(/\n$/, '').split('\n');
    const rows = lines.map(line => line.split(this.delimiter));
    rows.sort(this.compareRows.bind(this));
    const sortedLines = rows.map(row => row.join(this.delimiter));
    return sortedLines.join('\n');
  }
}

const isValidField = columnNumber => {
  const zero = 0;
  return Number.isInteger(+columnNumber) && +columnNumber > zero;
};

const parseUserArgs = userArgs => {
  const delimiter = ' ';
  const [, columnNumber, fileName] = userArgs;
  if (!isValidField(columnNumber)) {
    let error = `sort: -k ${columnNumber}: Invalid argument`;
    if (columnNumber === '0') {
      error = `sort: 0 field in key specs: Undefined error: 0\n${error}`;
    }
    return { error, columnNumber, fileName, delimiter };
  }
  return { error: '', fileName, columnNumber, delimiter };
};

module.exports = { Sort, isValidField, parseUserArgs };
