'use strict';

var assert = require('chai').assert;
var compile = require('../lib/compile');

var mus = { tag: 'seq',
  left: { tag: 'seq',
    left: { tag: 'note', pitch: 'c3', dur: 250 },
    right: { tag: 'rest', dur: 100 } },
  right: { tag: 'seq',
    left: { tag: 'note', pitch: 'd3', dur: 500 },
    right: { tag: 'note', pitch: 'f4', dur: 250 } } };
var note = [
  { tag: 'note', pitch: 'c3', start: 0, dur: 250 },
  { tag: 'rest', start: 250, dur: 100 },
  { tag: 'note', pitch: 'd3', start: 350, dur: 500 },
  { tag: 'note', pitch: 'f4', start: 850, dur: 250 }
];

test('rest', function () {
  assert.deepEqual(compile(mus), note, 'Four note test');
});
