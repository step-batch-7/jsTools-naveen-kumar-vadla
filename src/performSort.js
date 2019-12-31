'use strict';

const { parseUserArgs, Sort } = require('./sortLib');

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
  const { createReadStream, createStdinStream } = streams;
  const { error, fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
  if (error) {
    return onSortCompletion({ error, sortedLines: '' });
  }
  const sort = new Sort({ fileName, columnNumber, delimiter });
  const inputStream = fileName
    ? createReadStream(fileName)
    : createStdinStream();
  loadContentAndSort(inputStream, sort, onSortCompletion);
};

module.exports = { performSort, getErrorMessage };
