'use strict';

const { parseUserArgs, Sort } = require('./sortLib');

const performSort = (userArgs, streamPicker, onSortCompletion) => {
  const { error, fileName, columnNumber, delimiter } = parseUserArgs(userArgs);
  if (error) {
    onSortCompletion({ error, sortedLines: '' });
    return;
  }
  const inputStream = streamPicker.pick(fileName);
  const sort = new Sort({ fileName, columnNumber, delimiter });
  sort.loadContentAndSort(inputStream, onSortCompletion);
};

module.exports = { performSort };
