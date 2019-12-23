"use strict";

const { assert } = require("chai");

const { sortContent, parseUserOptions } = require("../src/sortLib");

const { performSortOperations } = require("../src/performSortOperations");

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

describe("performSortOperations", () => {
	it("Should give sorted Data of given File if exists", () => {
		const userArgs = ["-k", "1", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "a 9\nb 8\nc 7\nd 6\ne 5\nf 4\ng 3\nh 2\ni 1\n9 a\n8 b\n7 c\n6 d\n5 e\n4 f\n3 g\n2 h\n1 i\na b\nb c\nc d\nd e\ne f\nf g\ng h\nh i\ni j";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performSortOperations({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected =
			"1 i\n2 h\n3 g\n4 f\n5 e\n6 d\n7 c\n8 b\n9 a\na 9\na b\nb 8\nb c\nc 7\nc d\nd 6\nd e\ne 5\ne f\nf 4\nf g\ng 3\ng h\nh 2\nh i\ni 1\ni j";
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give error message if file doesn't exist", () => {
		const userArgs = ["-k", "1", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "a 9\nb 8";
		};
		const isFilePresent = filePath => {
			return false;
		};
		const actual = performSortOperations({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected = `sort: No such file or directory`;
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give empty string for empty file", () => {
		const userArgs = ["-k", "1", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performSortOperations({
			userArgs,
			readFromFile,
			isFilePresent
		});
		assert.deepStrictEqual(actual, "");
	});
});
