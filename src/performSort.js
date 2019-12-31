'use strict';

const { parseUserArgs, Sort } = require('./sortLib');

const getErrorMessage = errorCode => {
  const errorMessages = {};
  errorMessages.ENOENT = 'sort: No such file or directory';
  errorMessages.EISDIR = 'sort: Is a directory';
  errorMessages.EACCES = 'sort: Permission denied';
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

const getInputStream = (fileName, streams) => {
  const { createReadStream, createStdinStream } = streams;
  if (fileName) {
    return createReadStream(fileName);
  }
  return createStdinStream();
};

const performSort = (userArgs, streams, onSortCompletion) => {
  const { error, fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
  if (error) {
    onSortCompletion({ error, sortedLines: '' });
    return;
  }
  const sort = new Sort({ fileName, columnNumber, delimiter });
  const inputStream = getInputStream(fileName, streams);
  loadContentAndSort(inputStream, sort, onSortCompletion);
};

module.exports = { performSort, getErrorMessage };
