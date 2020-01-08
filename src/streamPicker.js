'use strict';

class StreamPicker {
  constructor(createFileStream, createStdinStream) {
    this.createFileStream = createFileStream;
    this.createStdinStream = createStdinStream;
  }
  pick(fileName) {
    if (fileName) {
      return this.createFileStream(fileName);
    }
    return this.createStdinStream();
  }
}

module.exports = { StreamPicker };
