"use strict";

const { performAction } = require("./src/sortLib");

const main = userArgs => {
	const sortedData = performAction(userArgs);
	console.log(sortedData.join("\n"));
};

main(process.argv.slice(2));
