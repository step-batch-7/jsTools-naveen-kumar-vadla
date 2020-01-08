'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const { StreamPicker } = require('../src/streamPicker');

describe('StreamPicker', () => {
  describe('pick', function() {
    let stream;
    beforeEach(() => {
      stream = { on: sinon.fake(), setEncoding: sinon.fake() };
    });

    it('should give file Stream for filename given', function() {
      const createFileStream = sinon.fake.returns(stream);
      const streamPicker = new StreamPicker(createFileStream);
      assert.strictEqual(streamPicker.pick('sampleFile.txt'), stream);
      assert.ok(createFileStream.calledWith('sampleFile.txt'));
      assert.strictEqual(createFileStream.callCount, 1);
    });

    it('should give stdin Stream for filename not given', function() {
      const createStdinStream = sinon.fake.returns(stream);
      const streamPicker = new StreamPicker(null, createStdinStream);
      assert.strictEqual(streamPicker.pick(undefined), stream);
      assert.strictEqual(createStdinStream.callCount, 1);
    });
  });
});
