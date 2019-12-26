"use strict";

const fs = require("fs");
const { stdout, stderr } = require("process");

const { sort } = require("./src/sortLib");

const main = userArgs => {
	const { sortedLines, error } = sort(userArgs, fs);
	stdout.write(sortedLines);
	stderr.write(error);
};

main(process.argv.slice(2));
