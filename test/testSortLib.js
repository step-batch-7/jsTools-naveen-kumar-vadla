"use strict";

const { assert } = require("chai");

const {
	sortContent,
	formatFileContent,
	parseUserOptions,
	generateErrorMessage
} = require("../src/sortLib");

describe("sortContent", () => {
	it("Should give sorted form of given fileContent with options delimeter ' '", () => {
		const fileContentWithOptions = {
			options: ["-k", "3"],
			fileContent: ["j 5 z", "i 4 y", "h 3 x", "g 2 w", "f 1 v"],
			delimiter: " "
		};
		const actual = sortContent(fileContentWithOptions);
		const expected = ["f 1 v", "g 2 w", "h 3 x", "i 4 y", "j 5 z"];
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give empty array if option -k not specified", () => {
		assert.deepStrictEqual(sortContent({ options: [], content: [] }), []);
	});

	it("Should give normally sorted data if specified field is more than the line length", () => {
		const fileContentWithOptions = {
			options: ["-k", "5"],
			fileContent: ["j 5 z", "i 4 y", "h 3 x", "g 2 w", "f 1 v"],
			delimiter: " "
		};
		const actual = sortContent(fileContentWithOptions);
		const expected = ["f 1 v", "g 2 w", "h 3 x", "i 4 y", "j 5 z"];
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give empty array if file content is empty", () => {
		const fileContentWithOptions = {
			options: ["-k", "1"],
			fileContent: [],
			delimiter: " "
		};
		const actual = sortContent(fileContentWithOptions);
		assert.deepStrictEqual(actual, []);
	});
});

describe("parseUserOptions", () => {
	it("Should parsed User Options", () => {
		const actual = parseUserOptions(["-k", "1", "./docs/sampleFile.txt"]);
		const expected = {
			fileName: "./docs/sampleFile.txt",
			options: ["-k", "1"],
			delimiter: " "
		};
		assert.deepStrictEqual(actual, expected);
	});
});

describe("generateErrorMessage", () => {
	it("Should give generated error message", () => {
		const actual = generateErrorMessage({
			cmd: "sort",
			msg: "No such file or directory"
		});
		const expected = `sort: No such file or directory`;
		assert.strictEqual(actual, expected);
	});
});
