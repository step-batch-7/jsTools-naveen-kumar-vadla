'use strict';

const fs = require('fs');
const { stdout, stderr } = process;

const { performSort } = require('./src/sortLib');

const onSortCompletion = ({ sortedLines, error }) => {
  stdout.write(sortedLines);
  stderr.write(error);
};

const main = () => {
  const [, , ...userArgs] = process.argv;
  performSort(userArgs, fs, onSortCompletion);
};

main();
