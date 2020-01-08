'use strict';

const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = process;

const { performSort } = require('./src/performSort');
const { StreamPicker } = require('./src/streamPicker');

const onSortCompletion = ({ sortedLines, error }) => {
  stdout.write(sortedLines);
  stderr.write(error);
};

const createStdinStream = () => stdin;

const main = () => {
  const [, , ...userArgs] = process.argv;
  const streamPicker = new StreamPicker(createReadStream, createStdinStream);
  performSort(userArgs, streamPicker, onSortCompletion);
};

main();
