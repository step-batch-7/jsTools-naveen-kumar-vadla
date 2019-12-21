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
			content: ["j 5 z", "i 4 y", "h 3 x", "g 2 w", "f 1 v"],
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
			options: ["-k", "1"]
		};
		assert.deepStrictEqual(actual, expected);
	});
});

describe("performAction", () => {
	it("Should give sorted Data of given File", () => {
		const userOptions = ["-k", "1", "./docs/sampleFile.txt"];
		const actual = performAction(userOptions);
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
});
