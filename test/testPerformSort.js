'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const {
  performSort,
  loadContentAndSort,
  getErrorMessage
} = require('../src/performSort');
const { Sort } = require('../src/sortLib');

describe('performSort', () => {
  describe('Operation on file', () => {
    let fileReadStream, onSortCompletion, pick;
    beforeEach(() => {
      fileReadStream = { setEncoding: sinon.fake(), on: sinon.fake() };
      pick = sinon.fake.returns(fileReadStream);
      onSortCompletion = sinon.fake();
    });
    it('Should give sorted data of given File if exists', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      performSort(userArgs, { pick }, onSortCompletion);
      fileReadStream.on.secondCall.args[1]('a 9\n1 i\nb 8\n2 h\na b\nb c\n');
      fileReadStream.on.thirdCall.args[1]();
      assert.strictEqual(fileReadStream.on.secondCall.args[0], 'data');
      assert.strictEqual(fileReadStream.on.thirdCall.args[0], 'end');
      assert.strictEqual(fileReadStream.setEncoding.callCount, 1);
      assert.strictEqual(fileReadStream.on.callCount, 3);
      assert.ok(fileReadStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give data sorted normally for absent field', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const sortedLines = 'g 2 w\nh 3 x\ni 4 y\nj 5 z';
      performSort(userArgs, { pick }, onSortCompletion);
      fileReadStream.on.secondCall.args[1]('j 5 z\ni 4 y\ng 2 w\nh 3 x');
      fileReadStream.on.thirdCall.args[1]();
      assert.strictEqual(fileReadStream.on.secondCall.args[0], 'data');
      assert.strictEqual(fileReadStream.on.thirdCall.args[0], 'end');
      assert.strictEqual(fileReadStream.setEncoding.callCount, 1);
      assert.strictEqual(fileReadStream.on.callCount, 3);
      assert.ok(fileReadStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give empty string for empty file', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      performSort(userArgs, { pick }, onSortCompletion);
      fileReadStream.on.secondCall.args[1]('');
      fileReadStream.on.thirdCall.args[1]();
      assert.strictEqual(fileReadStream.on.secondCall.args[0], 'data');
      assert.strictEqual(fileReadStream.on.thirdCall.args[0], 'end');
      assert.strictEqual(fileReadStream.setEncoding.callCount, 1);
      assert.strictEqual(fileReadStream.on.callCount, 3);
      assert.ok(fileReadStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error: '' }));
    });
    it('Should give error message if file does not exist', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const error = 'sort: No such file or directory';
      performSort(userArgs, { pick }, onSortCompletion);
      fileReadStream.on.firstCall.args[1]({ code: 'ENOENT' });
      assert.strictEqual(fileReadStream.on.firstCall.args[0], 'error');
      assert.strictEqual(fileReadStream.setEncoding.callCount, 1);
      assert.strictEqual(fileReadStream.on.callCount, 3);
      assert.ok(fileReadStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error message for directory as file', () => {
      const userArgs = ['-k', '1', './docs/'];
      const error = 'sort: Is a directory';
      performSort(userArgs, { pick }, onSortCompletion);
      fileReadStream.on.firstCall.args[1]({ code: 'EISDIR' });
      assert.strictEqual(fileReadStream.on.firstCall.args[0], 'error');
      assert.strictEqual(fileReadStream.setEncoding.callCount, 1);
      assert.strictEqual(fileReadStream.on.callCount, 3);
      assert.ok(fileReadStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error message for file w/out permissions', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const error = 'sort: Permission denied';
      performSort(userArgs, { pick }, onSortCompletion);
      fileReadStream.on.firstCall.args[1]({ code: 'EACCES' });
      assert.strictEqual(fileReadStream.on.firstCall.args[0], 'error');
      assert.strictEqual(fileReadStream.setEncoding.callCount, 1);
      assert.strictEqual(fileReadStream.on.callCount, 3);
      assert.ok(fileReadStream.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error for invalid column number', () => {
      const userArgs = ['-k', '-1', './docs/sampleFile.txt'];
      const error = 'sort: -k -1: Invalid argument';
      performSort(userArgs, {}, onSortCompletion);
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error for column number 0', () => {
      const userArgs = ['-k', '0', './docs/sampleFile.txt'];
      let error = 'sort: 0 field in key specs: Undefined error: 0\n';
      error = error + 'sort: -k 0: Invalid argument';
      performSort(userArgs, {}, onSortCompletion);
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
  });
  describe('Operation on stdin', () => {
    let stdin, pick, onSortCompletion;
    beforeEach(() => {
      stdin = { setEncoding: sinon.fake(), on: sinon.fake() };
      pick = sinon.fake.returns(stdin);
      onSortCompletion = sinon.fake();
    });
    it('Should give sorted data of given stdin content', () => {
      const userArgs = ['-k', '1'];
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      performSort(userArgs, { pick }, onSortCompletion);
      stdin.on.secondCall.args[1]('a 9\n1 i\nb 8\n2 h\na b\nb c\n');
      stdin.on.thirdCall.args[1]();
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      assert.strictEqual(stdin.setEncoding.callCount, 1);
      assert.strictEqual(stdin.on.callCount, 3);
      assert.ok(stdin.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give data sorted normally for absent field', () => {
      const userArgs = ['-k', '1'];
      const sortedLines = 'g 2 w\nh 3 x\ni 4 y\nj 5 z';
      performSort(userArgs, { pick }, onSortCompletion);
      stdin.on.secondCall.args[1]('j 5 z\ni 4 y\ng 2 w\nh 3 x');
      stdin.on.thirdCall.args[1]();
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      assert.strictEqual(stdin.setEncoding.callCount, 1);
      assert.strictEqual(stdin.on.callCount, 3);
      assert.ok(stdin.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give empty string for empty data', () => {
      const userArgs = ['-k', '1'];
      performSort(userArgs, { pick }, onSortCompletion);
      stdin.on.secondCall.args[1]('');
      stdin.on.thirdCall.args[1]();
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      assert.strictEqual(stdin.setEncoding.callCount, 1);
      assert.strictEqual(stdin.on.callCount, 3);
      assert.ok(stdin.setEncoding.calledWith('utf8'));
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error: '' }));
    });
    it('Should give error for invalid column number', () => {
      const userArgs = ['-k', '-1'];
      const error = 'sort: -k -1: Invalid argument';
      performSort(userArgs, {}, onSortCompletion);
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error for column number 0', () => {
      const userArgs = ['-k', '0', './docs/sampleFile.txt'];
      let error = 'sort: 0 field in key specs: Undefined error: 0\n';
      error = error + 'sort: -k 0: Invalid argument';
      performSort(userArgs, {}, onSortCompletion);
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
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
    loadContentAndSort(inputStream, onSortCompletion, sort);
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
    loadContentAndSort(inputStream, onSortCompletion, sort);
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
    loadContentAndSort(inputStream, onSortCompletion, sort);
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
    loadContentAndSort(inputStream, onSortCompletion, sort);
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
    loadContentAndSort(inputStream, onSortCompletion, sort);
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
    loadContentAndSort(inputStream, onSortCompletion, sort);
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
    const error = 'sort: Is a directory';
    assert.strictEqual(getErrorMessage('EISDIR'), error);
  });
  it('Should error for given error code EISDIR', () => {
    const error = 'sort: Permission denied';
    assert.strictEqual(getErrorMessage('EACCES'), error);
  });
  it('Should error for given error code EISDIR', () => {
    const error = 'sort: No such file or directory';
    assert.strictEqual(getErrorMessage('ENOENT'), error);
  });
  it('Should give undefined for if error code is not present', () => {
    assert.isUndefined(getErrorMessage('ERROR'));
  });
});
