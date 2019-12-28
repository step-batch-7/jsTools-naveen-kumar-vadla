'use strict';

const fs = require('fs');
const { stdout, stderr } = process;

const { sort } = require('./src/sortLib');

const main = () => {
  const two = 2;
  const userArgs = process.argv.slice(two);
  const { sortedLines, error } = sort(userArgs, fs);
  stdout.write(sortedLines);
  stderr.write(error);
};

main();
