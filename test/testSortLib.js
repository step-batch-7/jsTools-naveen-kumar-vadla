"use strict";

const { assert } = require("chai");

const {
	sortContent,
	formatFileContent,
	parseUserOptions,
	performSortOperation
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
			fileNames: ["./docs/sampleFile.txt"],
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

describe("performSortOperation", () => {
	it("Should give sorted Data of given File if exists", () => {
		const userArgs = ["-k", "1", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "a 9\nb 8\nc 7\nd 6\ne 5\nf 4\ng 3\nh 2\ni 1\n9 a\n8 b\n7 c\n6 d\n5 e\n4 f\n3 g\n2 h\n1 i\na b\nb c\nc d\nd e\ne f\nf g\ng h\nh i\ni j";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performSortOperation({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected = {
			sortedData:
				"1 i\n2 h\n3 g\n4 f\n5 e\n6 d\n7 c\n8 b\n9 a\na 9\na b\nb 8\nb c\nc 7\nc d\nd 6\nd e\ne 5\ne f\nf 4\nf g\ng 3\ng h\nh 2\nh i\ni 1\ni j"
		};
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
		const actual = performSortOperation({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected = { error: `sort: No such file or directory` };
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
		const actual = performSortOperation({
			userArgs,
			readFromFile,
			isFilePresent
		});
		assert.deepStrictEqual(actual, { sortedData: "" });
	});

	it("Should give normally sorted data if specified field is more than the line length", () => {
		const userArgs = ["-k", "5", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "j 5 z\ni 4 y\nh 3 x\ng 2 w\nf 1 v";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performSortOperation({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected = { sortedData: "f 1 v\ng 2 w\nh 3 x\ni 4 y\nj 5 z" };
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give error message if -k value is NaN", () => {
		const userArgs = ["-k", "abcd", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "j 5 z\ni 4 y\nh 3 x\ng 2 w\nf 1 v";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performSortOperation({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected = {
			error: `sort: -k abcd: Invalid argument`
		};
		assert.deepStrictEqual(actual, expected);
	});

	it("Should give error message for negative value for -k", () => {
		const userArgs = ["-k", "-5", "./docs/sampleFile.txt"];
		const readFromFile = fileName => {
			return "j 5 z\ni 4 y\nh 3 x\ng 2 w\nf 1 v";
		};
		const isFilePresent = filePath => {
			return true;
		};
		const actual = performSortOperation({
			userArgs,
			readFromFile,
			isFilePresent
		});
		const expected = {
			error: `sort: -k -5: Invalid argument`
		};
		assert.deepStrictEqual(actual, expected);
	});
});
