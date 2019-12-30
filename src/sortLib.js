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
  sortOnFile(fs) {
    let sortedLines = '';
    if (!fs.existsSync(this.fileName)) {
      return { error: 'sort: No such file or directory', sortedLines };
    }
    const lines = fs.readFileSync(this.fileName, 'utf-8').split('\n');
    const rows = lines.map(line => line.split(this.delimiter));
    rows.sort(this.compareRows.bind(this));
    sortedLines = rows.map(row => row.join(this.delimiter));
    return { sortedLines, error: '' };
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
    return {
      error: `sort: -k ${columnNumber}: Invalid argument`,
      columnNumber,
      fileName,
      delimiter
    };
  }
  return { error: '', fileName, columnNumber, delimiter };
};

const performSort = (userArgs, fs) => {
  const parsedUserArgs = parseUserArgs(userArgs);
  if (parsedUserArgs.error) {
    return { error: parsedUserArgs.error, sortedLines: '' };
  }
  const sort = new Sort(parsedUserArgs);
  const sortedFileLines = sort.sortOnFile(fs);
  if (sortedFileLines.error) {
    return { error: sortedFileLines.error, sortedLines: '' };
  }
  return { sortedLines: sortedFileLines.sortedLines.join('\n'), error: '' };
};

module.exports = { performSort, Sort, isValidField, parseUserArgs };
