'use strict';

const { assert } = require('chai');
const {
	sortRows,
	parseUserArgs,
	sort,
	isPositiveInteger
} = require('../src/sortLib');

describe('sortRows', () => {
	it("Should give sorted form of given fileContent with options delimeter ' '", () => {
		const lines = [['j 5 z'], ['i 4 y'], ['h 3 x'], ['g 2 w'], ['f 1 v']];
		const columnNumber = '3';
		const actual = sortRows(lines, columnNumber);
		const expected = [['f 1 v'], ['g 2 w'], ['h 3 x'], ['i 4 y'], ['j 5 z']];
		assert.deepStrictEqual(actual, expected);
	});
	it('Should give normally sorted data if specified field is more than the line length', () => {
		const lines = [['j 5 z'], ['i 4 y'], ['h 3 x'], ['g 2 w'], ['f 1 v']];
		const columnNumber = '5';
		const actual = sortRows(lines, columnNumber);
		const expected = [['f 1 v'], ['g 2 w'], ['h 3 x'], ['i 4 y'], ['j 5 z']];
		assert.deepStrictEqual(actual, expected);
	});
});

describe('parseUserArgs', () => {
	it('Should give parsed User Options if given column number is a positive number', () => {
		const actual = parseUserArgs(['-k', '1', './docs/sampleFile.txt']);
		const expected = {
			fileName: './docs/sampleFile.txt',
			columnNumber: '1',
			delimiter: ' ',
			error: ''
		};
		assert.deepStrictEqual(actual, expected);
	});
	it('Should give error if given column number is not a number', () => {
		const actual = parseUserArgs(['-k', 'a', './docs/sampleFile.txt']);
		const expected = { error: `sort: -k a: Invalid argument` };
		assert.deepStrictEqual(actual, expected);
	});
	it('Should give error if given column number is a negative number', () => {
		const actual = parseUserArgs(['-k', '-1', './docs/sampleFile.txt']);
		const expected = { error: `sort: -k -1: Invalid argument` };
		assert.deepStrictEqual(actual, expected);
	});
});

describe('sort', () => {
	it('Should give sorted Data of given File if exists', () => {
		const userArgs = ['-k', '1', './docs/sampleFile.txt'];
		const readFileSync = fileName => {
			return 'a 9\nb 8\nc 7\nd 6\ne 5\nf 4\ng 3\nh 2\ni 1\n9 a\n8 b\n7 c\n6 d\n5 e\n4 f\n3 g\n2 h\n1 i\na b\nb c\nc d\nd e\ne f\nf g\ng h\nh i\ni j';
		};
		const existsSync = filePath => {
			return true;
		};
		const actual = sort(userArgs, { readFileSync, existsSync });
		const expected = {
			sortedLines:
				'1 i\n2 h\n3 g\n4 f\n5 e\n6 d\n7 c\n8 b\n9 a\na 9\na b\nb 8\nb c\nc 7\nc d\nd 6\nd e\ne 5\ne f\nf 4\nf g\ng 3\ng h\nh 2\nh i\ni 1\ni j',
			error: ''
		};
		assert.deepStrictEqual(actual, expected);
	});
	it('Should give normally sorted data if specified field is more than the line length', () => {
		const userArgs = ['-k', '5', './docs/sampleFile.txt'];
		const readFileSync = fileName => {
			return 'j 5 z\ni 4 y\nh 3 x\ng 2 w\nf 1 v';
		};
		const existsSync = filePath => {
			return true;
		};
		const actual = sort(userArgs, { readFileSync, existsSync });
		const expected = {
			sortedLines: 'f 1 v\ng 2 w\nh 3 x\ni 4 y\nj 5 z',
			error: ''
		};
		assert.deepStrictEqual(actual, expected);
	});
	it('Should give empty string for empty file', () => {
		const userArgs = ['-k', '1', './docs/sampleFile.txt'];
		const readFileSync = fileName => {
			return '';
		};
		const existsSync = filePath => {
			return true;
		};
		const actual = sort(userArgs, { readFileSync, existsSync });
		assert.deepStrictEqual(actual, { sortedLines: '', error: '' });
	});
	it("Should give error message if file doesn't exist", () => {
		const userArgs = ['-k', '1', './docs/sampleFile.txt'];
		const readFileSync = fileName => {
			return 'a 9\nb 8';
		};
		const existsSync = filePath => {
			return false;
		};
		const actual = sort(userArgs, { readFileSync, existsSync });
		const expected = {
			sortedLines: '',
			error: `sort: No such file or directory`
		};
		assert.deepStrictEqual(actual, expected);
	});
	it('Should give error is invalid column number is given', () => {
		const userArgs = ['-k', '-1', './docs/sampleFile.txt'];
		const readFileSync = fileName => {
			return 'a 9\nb 8';
		};
		const existsSync = filePath => {
			return true;
		};
		const actual = sort(userArgs, { readFileSync, existsSync });
		const expected = {
			sortedLines: '',
			error: `sort: -k -1: Invalid argument`
		};
		assert.deepStrictEqual(actual, expected);
	});
});

describe('isPositiveInteger', () => {
	it('Should give true if given number is a positive integer', () => {
		const actual = isPositiveInteger(1);
		assert.ok(actual);
	});
	it('Should give false if given number is a negative integer', () => {
		const actual = isPositiveInteger(-1);
		assert.notOk(actual);
	});
	it('Should give false if given number is not a integer', () => {
		const actual = isPositiveInteger('a');
		assert.notOk(actual);
	});
});
