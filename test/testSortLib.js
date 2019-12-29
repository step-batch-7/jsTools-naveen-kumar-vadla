'use strict';

const { assert } = require('chai');
const { performSort, Sort } = require('../src/sortLib');

describe('Sort', () => {
  describe('parseUserArgs', () => {
    it('Should give no error for valid columnNumber', () => {
      const sort = new Sort();
      const actual = sort.parseUserArgs(['-k', '1', './docs/sampleFile.txt']);
      assert.deepStrictEqual(actual, '');
      assert.strictEqual(sort.columnNumber, '1');
      assert.strictEqual(sort.delimiter, ' ');
      assert.strictEqual(sort.fileName, './docs/sampleFile.txt');
    });
    it('Should give error if given column number is not a number', () => {
      const sort = new Sort();
      const actual = sort.parseUserArgs(['-k', 'a', './docs/sampleFile.txt']);
      assert.deepStrictEqual(actual, 'sort: -k a: Invalid argument');
    });
    it('Should give error if given column number is a negative number', () => {
      const sort = new Sort();
      const actual = sort.parseUserArgs(['-k', '-1', './docs/sampleFile.txt']);
      assert.deepStrictEqual(actual, 'sort: -k -1: Invalid argument');
    });
  });

  describe('isValidField', () => {
    it('Should give true if given number is a positive integer', () => {
      const sort = new Sort();
      sort.columnNumber = '1';
      const actual = sort.isValidField();
      assert.ok(actual);
    });
    it('Should give false if given number is a negative integer', () => {
      const sort = new Sort();
      sort.columnNumber = '-1';
      const actual = sort.isValidField();
      assert.notOk(actual);
    });
    it('Should give false if given number is not a integer', () => {
      const sort = new Sort();
      sort.columnNumber = 'a';
      const actual = sort.isValidField();
      assert.notOk(actual);
    });
  });

  describe('compareRows', () => {
    it('Should give 0 if field of given rows are equal', () => {
      const sort = new Sort();
      const row1 = ['a b'];
      const row2 = ['a b'];
      const actual = sort.compareRows(row1, row2);
      const expected = 0;
      assert.strictEqual(actual, expected);
    });
    it('Should give 1 if field of given row1 is greater', () => {
      const sort = new Sort();
      const row1 = ['c b'];
      const row2 = ['a b'];
      const actual = sort.compareRows(row1, row2);
      const expected = 1;
      assert.strictEqual(actual, expected);
    });
    it('Should give -1 if field of given row2 is greater', () => {
      const sort = new Sort();
      const row1 = ['a b'];
      const row2 = ['c b'];
      const actual = sort.compareRows(row1, row2);
      const expected = -1;
      assert.strictEqual(actual, expected);
    });
  });

  describe('sortOnFile', () => {
    it('Should give sorted data of given File if exists', () => {
      const sort = new Sort();
      sort.columnNumber = '1';
      sort.delimiter = ' ';
      sort.fileName = './docs/sampleFile.txt';
      const readFileSync = fileName => {
        assert.strictEqual(fileName, './docs/sampleFile.txt');
        return 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      };
      const existsSync = fileName => {
        assert.strictEqual(fileName, './docs/sampleFile.txt');
        return true;
      };
      const actual = sort.sortOnFile({ readFileSync, existsSync });
      const expected = {
        sortedLines: ['1 i', '2 h', 'a 9', 'a b', 'b 8', 'b c'],
        error: ''
      };
      assert.deepStrictEqual(actual, expected);
    });
    it('Should give data sorted normally for absent field', () => {
      const sort = new Sort();
      sort.columnNumber = '5';
      sort.delimiter = ' ';
      sort.fileName = './docs/sampleFile.txt';
      const readFileSync = fileName => {
        assert.strictEqual(fileName, './docs/sampleFile.txt');
        return 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      };
      const existsSync = fileName => {
        assert.strictEqual(fileName, './docs/sampleFile.txt');
        return true;
      };
      const actual = sort.sortOnFile({ readFileSync, existsSync });
      const expected = {
        sortedLines: ['1 i', '2 h', 'a 9', 'a b', 'b 8', 'b c'],
        error: ''
      };
      assert.deepStrictEqual(actual, expected);
    });
    it('Should give error if file is not present', () => {
      const sort = new Sort();
      sort.columnNumber = '5';
      sort.delimiter = ' ';
      sort.fileName = './docs/sampleFile.txt';
      const readFileSync = fileName => {
        assert.strictEqual(fileName, './docs/sampleFile.txt');
        return 'a 9\nb 8\n2 h\n1 i\na b\nb c';
      };
      const existsSync = fileName => {
        assert.strictEqual(fileName, './docs/sampleFile.txt');
        return false;
      };
      const actual = sort.sortOnFile({ readFileSync, existsSync });
      const expected = {
        sortedLines: '',
        error: 'sort: No such file or directory'
      };
      assert.deepStrictEqual(actual, expected);
    });
  });
});
describe('performSort', () => {
  it('Should give sorted data of given File if exists', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const readFileSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return 'a 9\nb 8\nc 7\nd 6\n4 f\n3 g\n2 h\n1 i\na b\nb c\nc d\nd e';
    };
    const existsSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return true;
    };
    const actual = performSort(userArgs, { readFileSync, existsSync });
    const expected = {
      sortedLines: '1 i\n2 h\n3 g\n4 f\na 9\na b\nb 8\nb c\nc 7\nc d\nd 6\nd e',
      error: ''
    };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give data sorted normally for absent field', () => {
    const userArgs = ['-k', '5', './docs/sampleFile.txt'];
    const readFileSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return 'j 5 z\ni 4 y\nh 3 x\ng 2 w\nf 1 v';
    };
    const existsSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return true;
    };
    const actual = performSort(userArgs, { readFileSync, existsSync });
    const expected = {
      sortedLines: 'f 1 v\ng 2 w\nh 3 x\ni 4 y\nj 5 z',
      error: ''
    };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give empty string for empty file', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const readFileSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return '';
    };
    const existsSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return true;
    };
    const actual = performSort(userArgs, { readFileSync, existsSync });
    assert.deepStrictEqual(actual, { sortedLines: '', error: '' });
  });
  it('Should give error message if file does not exist', () => {
    const userArgs = ['-k', '1', './docs/sampleFile.txt'];
    const readFileSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return 'a 9\nb 8';
    };
    const existsSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return false;
    };
    const actual = performSort(userArgs, { readFileSync, existsSync });
    const expected = {
      sortedLines: '',
      error: 'sort: No such file or directory'
    };
    assert.deepStrictEqual(actual, expected);
  });
  it('Should give error is invalid column number is given', () => {
    const userArgs = ['-k', '-1', './docs/sampleFile.txt'];
    const readFileSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return 'a 9\nb 8';
    };
    const existsSync = fileName => {
      assert.strictEqual(fileName, './docs/sampleFile.txt');
      return true;
    };
    const actual = performSort(userArgs, { readFileSync, existsSync });
    const expected = {
      sortedLines: '',
      error: 'sort: -k -1: Invalid argument'
    };
    assert.deepStrictEqual(actual, expected);
  });
});
