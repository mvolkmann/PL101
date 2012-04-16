'use strict';

var assert = require('chai').assert;
var compile = require('../lib/compile');

var melody1_mus = { tag: 'note', pitch: 'a4', dur: 125 };
var melody1_note = [{ tag: 'note', pitch: 'a4', start: 0, dur: 125 }];
var melody2_mus = { tag: 'seq',
  left: { tag: 'seq',
    left: { tag: 'note', pitch: 'a4', dur: 250 },
    right: { tag: 'note', pitch: 'b4', dur: 250 } },
  right: { tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 500 },
    right: { tag: 'note', pitch: 'd4', dur: 500 } } };
var melody2_note = [
  { tag: 'note', pitch: 'a4', start: 0, dur: 250 },
  { tag: 'note', pitch: 'b4', start: 250, dur: 250 },
  { tag: 'note', pitch: 'c4', start: 500, dur: 500 },
  { tag: 'note', pitch: 'd4', start: 1000, dur: 500 }
];

test('compile', function () {
  assert.deepEqual(compile(melody1_mus), melody1_note, 'One note test');
  assert.deepEqual(compile(melody2_mus), melody2_note, 'Four note test');
});
