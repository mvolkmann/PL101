'use strict';

var assert = require('chai').assert;
var compile = require('../lib/compile');

var mus = { tag: 'repeat',
  section: { tag: 'note', pitch: 'c3', dur: 100 },
  count: 2
};
var note = [
  { tag: 'note', pitch: 'c3', start: 0, dur: 100 },
  { tag: 'note', pitch: 'c3', start: 100, dur: 100 }
];

test('repeat', function () {
  assert.deepEqual(compile(mus), note, 'repeat test');
});
