'use strict';

const { parseUserArgs, Sort } = require('./sortLib');

const loadContentAndSort = (inputStream, onSortCompletion, sort) => {
  let content = '';
  inputStream.setEncoding('utf8');
  inputStream.on('error', error => {
    const streamError = getErrorMessage(error.code);
    onSortCompletion({ sortedLines: '', error: streamError });
  });
  inputStream.on('data', line => {
    content += line;
  });
  inputStream.on('end', () => {
    const sortedLines = sort.sortLines(content, onSortCompletion);
    onSortCompletion({ sortedLines, error: '' });
  });
};

const getErrorMessage = errorCode => {
  const errorMessages = {};
  errorMessages.ENOENT = 'sort: No such file or directory';
  errorMessages.EISDIR = 'sort: Is a directory';
  errorMessages.EACCES = 'sort: Permission denied';
  return errorMessages[errorCode];
};

const performSort = (userArgs, streamPicker, onSortCompletion) => {
  const { error, fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
  if (error) {
    onSortCompletion({ error, sortedLines: '' });
    return;
  }
  const inputStream = streamPicker.pick(fileName);
  const sort = new Sort({ fileName, columnNumber, delimiter });
  loadContentAndSort(inputStream, onSortCompletion, sort);
};

module.exports = { performSort, loadContentAndSort, getErrorMessage };
