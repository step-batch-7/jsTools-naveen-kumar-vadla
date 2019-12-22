"use strict";

const { assert } = require("chai");

const {
	sortContent,
	parseUserOptions,
	performAction
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

	it("Should give empty array if option  not specified", () => {
		assert.deepStrictEqual(sortContent({ options: [], content: [] }), []);
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

describe("performAction", () => {
	it("Should give sorted Data of given File if exists", () => {
		const userArgs = ["-k", "1", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "a 9\nb 8\nc 7\nd 6\ne 5\nf 4\ng 3\nh 2\ni 1\n9 a\n8 b\n7 c\n6 d\n5 e\n4 f\n3 g\n2 h\n1 i";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performAction({ userArgs, readFromFile, isFilePresent });
		const expected = [
			"1 i",
			"2 h",
			"3 g",
			"4 f",
			"5 e",
			"6 d",
			"7 c",
			"8 b",
			"9 a",
			"a 9",
			"b 8",
			"c 7",
			"d 6",
			"e 5",
			"f 4",
			"g 3",
			"h 2",
			"i 1"
		];
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give error message if file doesn't exist", () => {
		const userArgs = ["-k", "1", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "a 9\nb 8\nc 7\nd 6\ne 5\nf 4\ng 3\nh 2\ni 1\n9 a\n8 b\n7 c\n6 d\n5 e\n4 f\n3 g\n2 h\n1 i";
		};
		const isFilePresent = filePath => {
			return false;
		};
		const actual = performAction({ userArgs, readFromFile, isFilePresent });
		const expected = [`sort: No such file or directory`];
		assert.deepStrictEqual(actual, expected);
	});
});
