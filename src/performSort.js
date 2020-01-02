'use strict';

const { parseUserArgs, Sort } = require('./sortLib');

const getInputStream = (fileName, streams) => {
  if (fileName) {
    return streams.createReadStream(fileName);
  }
  return streams.createStdinStream();
};

const performSort = (userArgs, streams, onSortCompletion) => {
  const { error, fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
  if (error) {
    onSortCompletion({ error, sortedLines: '' });
    return;
  }
  const inputStream = getInputStream(fileName, streams);
  const sort = new Sort({ fileName, columnNumber, delimiter });
  sort.loadContentAndSort(inputStream, onSortCompletion);
};

module.exports = { performSort };
