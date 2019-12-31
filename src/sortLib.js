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
    return {
      error: `sort: -k ${columnNumber}: Invalid argument`,
      columnNumber,
      fileName,
      delimiter
    };
  }
  return { error: '', fileName, columnNumber, delimiter };
};

const getErrorMessage = errorCode => {
  const errorMessages = {
    ENOENT: 'sort: No such file or directory',
    EISDIR: 'sort: Is a directory',
    EACCES: 'sort: Permission denied'
  };
  return errorMessages[errorCode];
};

const loadContentAndSort = (inputStream, sort, onSortCompletion) => {
  let content = '';
  inputStream.on('error', error => {
    const streamError = getErrorMessage(error.code);
    onSortCompletion({ sortedLines: '', error: streamError });
  });
  inputStream.on('data', line => {
    content += line.toString();
  });
  inputStream.on('end', () => {
    const sortedLines = sort.sortLines(content, onSortCompletion);
    onSortCompletion({ sortedLines, error: '' });
  });
};

const performSort = (userArgs, streams, onSortCompletion) => {
  const { error, fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
  if (error) {
    return onSortCompletion({ error, sortedLines: '' });
  }
  const sort = new Sort({ fileName, columnNumber, delimiter });
  const inputStream = fileName
    ? streams.createReadStream(fileName)
    : streams.createStdinStream();
  loadContentAndSort(inputStream, sort, onSortCompletion);
};

module.exports = {
  Sort,
  performSort,
  isValidField,
  parseUserArgs,
  getErrorMessage
};
