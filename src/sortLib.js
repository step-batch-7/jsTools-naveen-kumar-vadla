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

const getFileLines = (fs, fileName) => {
  if (!fs.existsSync(fileName)) {
    return { error: 'sort: No such file or directory', lines: '' };
  }
  const lines = fs.readFileSync(fileName, 'utf-8');
  return { lines, error: '' };
};

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
  const fileContent = getFileLines(fs, parsedUserArgs.fileName);
  if (fileContent.error) {
    return { error: fileContent.error, sortedLines: '' };
  }
  const sortedLines = sort.sortLines(fileContent.lines);
  return { sortedLines, error: '' };
};

module.exports = {
  Sort,
  performSort,
  isValidField,
  parseUserArgs,
  getFileLines
};
