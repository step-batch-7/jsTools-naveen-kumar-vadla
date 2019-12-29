'use strict';

const fs = require('fs');
const { stdout, stderr } = process;

const { performSort } = require('./src/sortLib');

const main = () => {
  const [, , ...userArgs] = process.argv;
  const { sortedLines, error } = performSort(userArgs, fs);
  stdout.write(sortedLines);
  stderr.write(error);
};

main();
