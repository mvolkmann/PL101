'use strict';

var assert = require('chai').assert;
var endTime = require('../lib/endTime');

var melody1_mus = { tag: 'note', pitch: 'a4', dur: 125 };

var melody2_mus = { tag: 'seq',
  left: { tag: 'seq',
    left: { tag: 'note', pitch: 'a4', dur: 250 },
    right: { tag: 'note', pitch: 'b4', dur: 250 } },
    right: { tag: 'seq',
      left: { tag: 'note', pitch: 'c4', dur: 500 },
      right: { tag: 'note', pitch: 'd4', dur: 500 } } };

test('endTime', function () {
  assert.equal(endTime(500, melody1_mus), 625, 'One note test');
  assert.equal(endTime(0, melody2_mus), 1500, 'Four note test');
});
