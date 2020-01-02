'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const { EventEmitter } = require('events');
const {
  Sort,
  parseUserArgs,
  isValidField,
  getErrorMessage
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
      const actual = sort.sortLines(lines);
      const sortedLines = 'b 8\na 9\na b\nb c\n2 h\n1 i';
      assert.deepStrictEqual(actual, sortedLines);
    });
    it('Should give data sorted normally for absent field', () => {
      const columnNumber = '5';
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      const lines = 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      const actual = sort.sortLines(lines);
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      assert.deepStrictEqual(actual, sortedLines);
    });
  });
  describe('loadContentAndSort', () => {
    it('Should give error if file is not present', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './badFile.txt';
      const inputStream = new EventEmitter();
      const onSortCompletion = sinon.fake();
      const error = 'sort: No such file or directory';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.emit('error', { code: 'ENOENT' });
      assert.ok(onSortCompletion.calledWith({ error, sortedLines: '' }));
    });
    it('Should give error if a directory given as fileName', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs';
      const inputStream = new EventEmitter();
      const onSortCompletion = sinon.fake();
      const error = 'sort: Is a directory';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.emit('error', { code: 'EISDIR' });
      assert.ok(onSortCompletion.calledWith({ error, sortedLines: '' }));
    });
    it('Should give error if file permissions are missing ', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const inputStream = new EventEmitter();
      const onSortCompletion = sinon.fake();
      const error = 'sort: Permission denied';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.emit('error', { code: 'EACCES' });
      assert.ok(onSortCompletion.calledWith({ error, sortedLines: '' }));
    });
    it('Should give sorted lines for valid file and columnNumber', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const inputStream = new EventEmitter();
      const onSortCompletion = sinon.fake();
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.emit('data', 'b a\na b');
      inputStream.emit('end');
      assert.ok(
        onSortCompletion.calledWith({ error: '', sortedLines: 'a b\nb a' })
      );
    });
    it('Should give normally sorted data for absent columnNumber', () => {
      const columnNumber = 5;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const inputStream = new EventEmitter();
      const onSortCompletion = sinon.fake();
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.emit('data', 'b a\na b');
      inputStream.emit('end');
      assert.ok(
        onSortCompletion.calledWith({ error: '', sortedLines: 'a b\nb a' })
      );
    });
    it('Should give empty string for empty content', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const inputStream = new EventEmitter();
      const onSortCompletion = sinon.fake();
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.emit('data', '');
      inputStream.emit('end');
      assert.ok(onSortCompletion.calledWith({ error: '', sortedLines: '' }));
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
describe('getErrorMessage', () => {
  it('Should error for given error code', () => {
    assert.strictEqual(getErrorMessage('EISDIR'), 'sort: Is a directory');
    assert.strictEqual(getErrorMessage('EACCES'), 'sort: Permission denied');
  });
  it('Should give undefined for if error code is not present', () => {
    assert.isUndefined(getErrorMessage('ERROR'));
  });
});
