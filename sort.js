'use strict';

const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = process;

const { performSort } = require('./src/sortLib');

const onSortCompletion = ({ sortedLines, error }) => {
  stdout.write(sortedLines);
  stderr.write(error);
};

const createStdinStream = () => stdin;

const main = () => {
  const [, , ...userArgs] = process.argv;
  const streams = { createReadStream, createStdinStream };
  performSort(userArgs, streams, onSortCompletion);
};

main();
