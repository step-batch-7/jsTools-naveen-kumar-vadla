'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const { Sort, parseUserArgs, isValidField } = require('../src/sortLib');

describe('Sort', () => {
  describe('compareRows', () => {
    it('Should give 0 if field of given rows are equal', () => {
      const parsedUserOptions = { columnNumber: 1 };
      const sort = new Sort(parsedUserOptions);
      assert.strictEqual(sort.compareRows(['a b'], ['a b']), 0);
    });
    it('Should give 1 if field of given row1 is greater', () => {
      const parsedUserOptions = { columnNumber: 1 };
      const sort = new Sort(parsedUserOptions);
      assert.strictEqual(sort.compareRows(['c b'], ['a b']), 1);
    });
    it('Should give -1 if field of given row2 is greater', () => {
      const parsedUserOptions = { columnNumber: 1 };
      const sort = new Sort(parsedUserOptions);
      assert.strictEqual(sort.compareRows(['a b'], ['c b']), -1);
    });
  });
  describe('sortLines', () => {
    it('Should give sorted lines if given field is present', () => {
      const columnNumber = '2';
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      const lines = 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      const sortedLines = 'b 8\na 9\na b\nb c\n2 h\n1 i';
      assert.deepStrictEqual(sort.sortLines(lines), sortedLines);
    });
    it('Should give data sorted normally for absent field', () => {
      const columnNumber = '5';
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      const lines = 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      assert.deepStrictEqual(sort.sortLines(lines), sortedLines);
    });
  });
  describe('loadContentAndSort', () => {
    let inputStream, onSortCompletion;
    beforeEach(() => {
      inputStream = { setEncoding: sinon.fake(), on: sinon.fake() };
      onSortCompletion = sinon.fake();
    });
    it('Should give error if file is not present', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './badFile.txt';
      const error = 'sort: No such file or directory';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.on.firstCall.args[1]({ code: 'ENOENT' });
      assert.strictEqual(inputStream.on.firstCall.args[0], 'error');
      assert.strictEqual(inputStream.setEncoding.callCount, 1);
      assert.strictEqual(inputStream.on.callCount, 3);
      assert.ok(inputStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ error, sortedLines: '' }));
    });
    it('Should give error if a directory given as fileName', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs';
      const error = 'sort: Is a directory';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.on.firstCall.args[1]({ code: 'EISDIR' });
      assert.strictEqual(inputStream.on.firstCall.args[0], 'error');
      assert.strictEqual(inputStream.setEncoding.callCount, 1);
      assert.strictEqual(inputStream.on.callCount, 3);
      assert.ok(inputStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ error, sortedLines: '' }));
    });
    it('Should give error if file permissions are missing ', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const error = 'sort: Permission denied';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.on.firstCall.args[1]({ code: 'EACCES' });
      assert.strictEqual(inputStream.on.firstCall.args[0], 'error');
      assert.strictEqual(inputStream.setEncoding.callCount, 1);
      assert.strictEqual(inputStream.on.callCount, 3);
      assert.ok(inputStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ error, sortedLines: '' }));
    });
    it('Should give sorted lines for valid file and columnNumber', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.on.secondCall.args[1]('b a\na b');
      inputStream.on.thirdCall.args[1]();
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      assert.strictEqual(inputStream.setEncoding.callCount, 1);
      assert.strictEqual(inputStream.on.callCount, 3);
      assert.ok(inputStream.setEncoding.calledWith('utf8'));
      assert.ok(
        onSortCompletion.calledWith({ error: '', sortedLines: 'a b\nb a' })
      );
    });
    it('Should give normally sorted data for absent columnNumber', () => {
      const columnNumber = 5;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.on.secondCall.args[1]('b a\na b');
      inputStream.on.thirdCall.args[1]();
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      assert.strictEqual(inputStream.setEncoding.callCount, 1);
      assert.strictEqual(inputStream.on.callCount, 3);
      assert.ok(inputStream.setEncoding.calledWith('utf8'));
      assert.ok(
        onSortCompletion.calledWith({ error: '', sortedLines: 'a b\nb a' })
      );
    });
    it('Should give empty string for empty content', () => {
      const columnNumber = 1;
      const delimiter = ' ';
      const fileName = './docs/sampleFile.txt';
      const sort = new Sort({ columnNumber, delimiter, fileName });
      sort.loadContentAndSort(inputStream, onSortCompletion);
      inputStream.on.secondCall.args[1]('');
      inputStream.on.thirdCall.args[1]();
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      assert.strictEqual(inputStream.setEncoding.callCount, 1);
      assert.strictEqual(inputStream.on.callCount, 3);
      assert.ok(inputStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ error: '', sortedLines: '' }));
    });
  });
  describe('getErrorMessage', () => {
    it('Should error for given error code EISDIR', () => {
      const sort = new Sort({});
      const error = 'sort: Is a directory';
      assert.strictEqual(sort.getErrorMessage('EISDIR'), error);
    });
    it('Should error for given error code EISDIR', () => {
      const sort = new Sort({});
      const error = 'sort: Permission denied';
      assert.strictEqual(sort.getErrorMessage('EACCES'), error);
    });
    it('Should error for given error code EISDIR', () => {
      const sort = new Sort({});
      const error = 'sort: No such file or directory';
      assert.strictEqual(sort.getErrorMessage('ENOENT'), error);
    });
    it('Should give undefined for if error code is not present', () => {
      const sort = new Sort({});
      assert.isUndefined(sort.getErrorMessage('ERROR'));
    });
  });
});
describe('parseUserArgs', () => {
  it('Should give no error for valid columnNumber', () => {
    const columnNumber = '1';
    const delimiter = ' ';
    const fileName = './docs/sampleFile.txt';
    const error = '';
    const actual = parseUserArgs(['-k', '1', './docs/sampleFile.txt']);
    const expected = { columnNumber, delimiter, fileName, error };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error if given column number is not a number', () => {
    const columnNumber = 'a';
    const fileName = './docs/sampleFile.txt';
    const delimiter = ' ';
    const error = 'sort: -k a: Invalid argument';
    const actual = parseUserArgs(['-k', 'a', './docs/sampleFile.txt']);
    const expected = { columnNumber, delimiter, fileName, error };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error if given column number is a negative number', () => {
    const columnNumber = '-1';
    const fileName = './docs/sampleFile.txt';
    const delimiter = ' ';
    const error = 'sort: -k -1: Invalid argument';
    const actual = parseUserArgs(['-k', '-1', './docs/sampleFile.txt']);
    const expected = { columnNumber, delimiter, fileName, error };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error for column number 0', () => {
    const columnNumber = '0';
    const fileName = './docs/sampleFile.txt';
    const delimiter = ' ';
    let error = 'sort: 0 field in key specs: Undefined error: 0\n';
    error = error + 'sort: -k 0: Invalid argument';
    const actual = parseUserArgs(['-k', '0', './docs/sampleFile.txt']);
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
