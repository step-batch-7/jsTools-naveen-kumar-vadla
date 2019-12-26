"use strict";

const fs = require("fs");
const { stdout, stderr } = require("process");

const { sort } = require("./src/sortLib");

const main = userArgs => {
	const result = sort(userArgs, fs);
	stdout.write(result.sortedLines);
	stderr.write(result.error);
};

main(process.argv.slice(2));
