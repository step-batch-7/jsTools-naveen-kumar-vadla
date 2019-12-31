'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const {
  Sort,
  performSort,
  parseUserArgs,
  isValidField,
  getFileLines
} = require('../src/sortLib');

describe('Sort', () => {
  describe('compareRows', () => {
    it('Should give 0 if field of given rows are equal', () => {
      const parsedUserOptions = { columnNumber: 1 };
      const sort = new Sort(parsedUserOptions);
      const actual = sort.compareRows(['a b'], ['a b']);
      const expected = 0;
      assert.strictEqual(actual, expected);
    });
    it('Should give 1 if field of given row1 is greater', () => {
      const parsedUserOptions = { columnNumber: 1 };
      const sort = new Sort(parsedUserOptions);
      const actual = sort.compareRows(['c b'], ['a b']);
      const expected = 1;
      assert.strictEqual(actual, expected);
    });
    it('Should give -1 if field of given row2 is greater', () => {
      const parsedUserOptions = { columnNumber: 1 };
      const sort = new Sort(parsedUserOptions);
      const actual = sort.compareRows(['a b'], ['c b']);
      const expected = -1;
      assert.strictEqual(actual, expected);
    });
  });
  describe('sortLines', () => {
    it('Should give sorted lines if given field is present', () => {
      const columnNumber = '2';
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      const lines = 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      const onSortComplete = sinon.fake();
      sort.sortLines(lines, onSortComplete);
      const sortedLines = 'b 8\na 9\na b\nb c\n2 h\n1 i';
      assert.ok(onSortComplete.calledWith({ sortedLines, error: '' }));
    });
    it('Should give data sorted normally for absent field', () => {
      const columnNumber = '5';
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      const lines = 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      const onSortComplete = sinon.fake();
      sort.sortLines(lines, onSortComplete);
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      assert.ok(onSortComplete.calledWith({ sortedLines, error: '' }));
    });
  });
});
describe('parseUserArgs', () => {
  it('Should give no error for valid columnNumber', () => {
    const actual = parseUserArgs(['-k', '1', './docs/sampleFile.txt']);
    const columnNumber = '1';
    const delimiter = ' ';
    const fileName = './docs/sampleFile.txt';
    const error = '';
    const expected = { columnNumber, delimiter, fileName, error };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error if given column number is not a number', () => {
    const actual = parseUserArgs(['-k', 'a', './docs/sampleFile.txt']);
    const columnNumber = 'a';
    const fileName = './docs/sampleFile.txt';
    const delimiter = ' ';
    const error = 'sort: -k a: Invalid argument';
    const expected = { columnNumber, delimiter, fileName, error };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error if given column number is a negative number', () => {
    const actual = parseUserArgs(['-k', '-1', './docs/sampleFile.txt']);
    const columnNumber = '-1';
    const fileName = './docs/sampleFile.txt';
    const delimiter = ' ';
    const error = 'sort: -k -1: Invalid argument';
    const expected = { columnNumber, delimiter, fileName, error };
    assert.deepStrictEqual(actual, expected);
  });
});
describe('isValidField', () => {
  it('Should give true if given number is a positive integer', () => {
    assert.ok(isValidField('1'));
  });
  it('Should give false if given number is a negative integer', () => {
    assert.notOk(isValidField('-1'));
  });
  it('Should give false if given number is not a integer', () => {
    assert.notOk(isValidField('a'));
  });
});
describe('getFileLines', () => {
  it('Should give file content if file is present', () => {
    const fileName = './docs/sampleFile.txt';
    const readFileSync = sinon.fake.returns('a 9\nb 8\n2 h\n1 i\na b\nb c');
    const existsSync = sinon.fake.returns(true);
    const actual = getFileLines({ readFileSync, existsSync }, fileName);
    const expected = { lines: 'a 9\nb 8\n2 h\n1 i\na b\nb c', error: '' };
    assert.ok(readFileSync.calledWith(fileName));
    assert.ok(existsSync.calledWith(fileName));
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error message if file is not present', () => {
    const fileName = './docs/sampleFile.txt';
    const existsSync = sinon.fake.returns(false);
    const actual = getFileLines({ existsSync }, fileName);
    const expected = { error: 'sort: No such file or directory', lines: '' };
    assert.ok(existsSync.calledWith(fileName));
    assert.deepStrictEqual(actual, expected);
  });
});
describe('performSort', () => {
  it('Should give sorted data of given File if exists', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const fileName = './docs/sampleFile.txt';
    const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
    const readFileSync = sinon.fake.returns('a 9\nb 8\n2 h\n1 i\na b\nb c');
    const existsSync = sinon.fake.returns(true);
    const onSortCompletion = sinon.fake();
    performSort(userArgs, { readFileSync, existsSync }, onSortCompletion);
    assert.ok(readFileSync.calledWith(fileName));
    assert.ok(existsSync.calledWith(fileName));
    assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
  });
  it('Should give data sorted normally for absent field', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const fileName = './docs/sampleFile.txt';
    const sortedLines = 'g 2 w\nh 3 x\ni 4 y\nj 5 z';
    const readFileSync = sinon.fake.returns('j 5 z\ni 4 y\nh 3 x\ng 2 w');
    const existsSync = sinon.fake.returns(true);
    const onSortCompletion = sinon.fake();
    performSort(userArgs, { readFileSync, existsSync }, onSortCompletion);
    assert.ok(readFileSync.calledWith(fileName));
    assert.ok(existsSync.calledWith(fileName));
    assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
  });
  it('Should give empty string for empty file', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const fileName = './docs/sampleFile.txt';
    const readFileSync = sinon.fake.returns('');
    const existsSync = sinon.fake.returns(true);
    const onSortCompletion = sinon.fake();
    performSort(userArgs, { readFileSync, existsSync }, onSortCompletion);
    assert.ok(readFileSync.calledWith(fileName));
    assert.ok(existsSync.calledWith(fileName));
    assert.ok(onSortCompletion.calledWith({ sortedLines: '', error: '' }));
    performSort(userArgs, { readFileSync, existsSync }, onSortCompletion);
  });
  it('Should give error message if file does not exist', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const fileName = './docs/sampleFile.txt';
    const error = 'sort: No such file or directory';
    const existsSync = sinon.fake.returns(false);
    const onSortCompletion = sinon.fake();
    performSort(userArgs, { existsSync }, onSortCompletion);
    assert.ok(existsSync.calledWith(fileName));
    assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
  });
  it('Should give error is invalid column number is given', () => {
    const userArgs = ['-k', '-1', './docs/sampleFile.txt'];
    const error = 'sort: -k -1: Invalid argument';
    const onSortCompletion = sinon.fake();
    performSort(userArgs, {}, onSortCompletion);
    assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
  });
});
