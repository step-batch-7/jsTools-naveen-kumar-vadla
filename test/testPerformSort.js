'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const { EventEmitter } = require('events');
const { performSort } = require('../src/performSort');

describe('performSort', () => {
  describe('Operation on file', () => {
    let fileReadStream, createReadStream, onSortCompletion;
    beforeEach(() => {
      fileReadStream = new EventEmitter();
      createReadStream = sinon.fake.returns(fileReadStream);
      onSortCompletion = sinon.fake();
    });
    it('Should give sorted data of given File if exists', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      performSort(userArgs, { createReadStream }, onSortCompletion);
      fileReadStream.emit('data', 'a 9\n1 i\nb 8\n2 h\na b\nb c\n');
      fileReadStream.emit('end');
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give data sorted normally for absent field', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const sortedLines = 'g 2 w\nh 3 x\ni 4 y\nj 5 z';
      performSort(userArgs, { createReadStream }, onSortCompletion);
      fileReadStream.emit('data', 'j 5 z\ni 4 y\ng 2 w\nh 3 x');
      fileReadStream.emit('end');
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give empty string for empty file', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      performSort(userArgs, { createReadStream }, onSortCompletion);
      fileReadStream.emit('data', '');
      fileReadStream.emit('end');
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error: '' }));
    });
    it('Should give error message if file does not exist', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const error = 'sort: No such file or directory';
      performSort(userArgs, { createReadStream }, onSortCompletion);
      fileReadStream.emit('error', { code: 'ENOENT' });
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error message for directory as file', () => {
      const userArgs = ['-k', '1', './docs/'];
      const error = 'sort: Is a directory';
      performSort(userArgs, { createReadStream }, onSortCompletion);
      fileReadStream.emit('error', { code: 'EISDIR' });
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error message for file w/out permissions', () => {
      const userArgs = ['-k', '1', './docs/sampleFile.txt'];
      const error = 'sort: Permission denied';
      performSort(userArgs, { createReadStream }, onSortCompletion);
      fileReadStream.emit('error', { code: 'EACCES' });
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
    it('Should give error for invalid column number', () => {
      const userArgs = ['-k', '-1', './docs/sampleFile.txt'];
      const error = 'sort: -k -1: Invalid argument';
      performSort(userArgs, {}, onSortCompletion);
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
  });
  describe('Operation on stdin', () => {
    let stdin, createStdinStream, onSortCompletion;
    beforeEach(() => {
      stdin = new EventEmitter();
      createStdinStream = sinon.fake.returns(stdin);
      onSortCompletion = sinon.fake();
    });
    it('Should give sorted data of given stdin content', () => {
      const userArgs = ['-k', '1'];
      const sortedLines = '1 i\n2 h\na 9\na b\nb 8\nb c';
      performSort(userArgs, { createStdinStream }, onSortCompletion);
      stdin.emit('data', 'a 9\n1 i\nb 8\n2 h\na b\nb c\n');
      stdin.emit('end');
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give data sorted normally for absent field', () => {
      const userArgs = ['-k', '1'];
      const sortedLines = 'g 2 w\nh 3 x\ni 4 y\nj 5 z';
      performSort(userArgs, { createStdinStream }, onSortCompletion);
      stdin.emit('data', 'j 5 z\ni 4 y\ng 2 w\nh 3 x');
      stdin.emit('end');
      assert.ok(onSortCompletion.calledWith({ sortedLines, error: '' }));
    });
    it('Should give empty string for empty data', () => {
      const userArgs = ['-k', '1'];
      performSort(userArgs, { createStdinStream }, onSortCompletion);
      stdin.emit('data', '');
      stdin.emit('end');
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error: '' }));
    });
    it('Should give error for invalid column number', () => {
      const userArgs = ['-k', '-1'];
      const error = 'sort: -k -1: Invalid argument';
      performSort(userArgs, {}, onSortCompletion);
      assert.ok(onSortCompletion.calledWith({ sortedLines: '', error }));
    });
  });
});
