'use strict';

class Sort {
  constructor() {
    this.columnNumber = 1;
    this.delimiter = ' ';
  }
  isValidField() {
    const zero = 0;
    return Number.isInteger(+this.columnNumber) && +this.columnNumber > zero;
  }
  parseUserArgs(userArgs) {
    [, this.columnNumber, this.fileName] = userArgs;
    if (!this.isValidField(this.columnNumber)) {
      return `sort: -k ${this.columnNumber}: Invalid argument`;
    }
    return '';
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

const performSort = (userArgs, fs) => {
  const sort = new Sort();
  const error = sort.parseUserArgs(userArgs);
  if (error) {
    return { error, sortedLines: '' };
  }
  const sortedFileLines = sort.sortOnFile(fs);
  if (sortedFileLines.error) {
    return { error: sortedFileLines.error, sortedLines: '' };
  }
  return { sortedLines: sortedFileLines.sortedLines.join('\n'), error: '' };
};

module.exports = { performSort, Sort };
