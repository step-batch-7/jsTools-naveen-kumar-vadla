"use strict";

const fs = require("fs");
const { stdout, stderr } = require("process");

const { performSortOperation } = require("./src/sortLib");

const main = userArgs => {
	const result = performSortOperation(userArgs, fs);
	stdout.write(result.sortedData);
	stderr.write(result.error);
};

main(process.argv.slice(2));
