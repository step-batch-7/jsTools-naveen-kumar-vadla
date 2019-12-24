"use strict";

const { assert } = require("chai");

const {
	sortContent,
	formatFileContent,
	parseUserOptions
} = require("../src/sortLib");

describe("sortContent", () => {
	it("Should give sorted form of given fileContent with options delimeter ' '", () => {
		const fileContentWithOptions = {
			options: ["-k", "3"],
			content: ["j 5 z", "i 4 y", "h 3 x", "g 2 w", "f 1 v"],
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
			content: ["j 5 z", "i 4 y", "h 3 x", "g 2 w", "f 1 v"],
			delimiter: " "
		};
		const actual = sortContent(fileContentWithOptions);
		const expected = ["f 1 v", "g 2 w", "h 3 x", "i 4 y", "j 5 z"];
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give empty array if file content is empty", () => {
		const fileContentWithOptions = {
			options: ["-k", "1"],
			content: [],
			delimiter: " "
		};
		const actual = sortContent(fileContentWithOptions);
		assert.deepStrictEqual(actual, []);
	});
});

describe("parseUserOptions", () => {
	it("Should give parsed User Options", () => {
		const actual = parseUserOptions(["-k", "1", "./docs/sampleFile.txt"]);
		const expected = {
			fileName: ["./docs/sampleFile.txt"],
			options: ["-k", "1"],
			delimiter: " "
		};
		assert.deepStrictEqual(actual, expected);
	});
});

describe("formatFileContent", () => {
	it("Should give formatted fileContent if fileContent is given ", () => {
		const fileContent = ["a b", "c d", "e f", "a 1", "c 3", "e 5"];
		const actual = formatFileContent(fileContent, " ", ["-k", "1"]);
		const expected = {
			a: ["a b", "a 1"],
			c: ["c d", "c 3"],
			e: ["e f", "e 5"]
		};
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give empty object for empty fileContent", () => {
		const actual = formatFileContent([], " ", ["-k", "1"]);
		assert.deepStrictEqual(actual, {});
	});

	it("Should give object with only one value for -k value is more than line fields", () => {
		const fileContent = ["a b", "c d", "e f", "a 1", "c 3", "e 5"];
		const actual = formatFileContent(fileContent, " ", ["-k", "5"]);
		const expected = { undefined: ["a b", "c d", "e f", "a 1", "c 3", "e 5"] };
		assert.deepStrictEqual(actual, expected);
	});
});
