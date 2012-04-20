'use strict';

var assert = require('chai').assert;
var compile = require('../lib/compile1');

var mus1 = { tag: 'note', pitch: 'a4', dur: 125 };
var note1 = [{ tag: 'note', pitch: 'a4', start: 0, dur: 125 }];
var mus2 = { tag: 'seq',
  left: { tag: 'seq',
    left: { tag: 'note', pitch: 'a4', dur: 250 },
    right: { tag: 'note', pitch: 'b4', dur: 250 } },
  right: { tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 500 },
    right: { tag: 'note', pitch: 'd4', dur: 500 } } };
var note2 = [
  { tag: 'note', pitch: 'a4', start: 0, dur: 250 },
  { tag: 'note', pitch: 'b4', start: 250, dur: 250 },
  { tag: 'note', pitch: 'c4', start: 500, dur: 500 },
  { tag: 'note', pitch: 'd4', start: 1000, dur: 500 }
];

test('compile1', function () {
  assert.deepEqual(compile(mus1), note1, 'One note test');
  assert.deepEqual(compile(mus2), note2, 'Four note test');
});
