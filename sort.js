'use strict';

const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = process;

const { performSort } = require('./src/sortLib');

const onSortCompletion = ({ sortedLines, error }) => {
  stdout.write(sortedLines);
  stderr.write(error);
};

const main = () => {
  const [, , ...userArgs] = process.argv;
  performSort(userArgs, { createReadStream, stdin }, onSortCompletion);
};

main();
