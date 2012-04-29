'use strict';

var assert = require('chai').assert;
var evaluate = require('../lib/try1');

test('try1', function () {
  assert.equal(evaluate(['+', 2, 3]), 5);
  assert.equal(evaluate(['*', 2, 3]), 6);
  assert.equal(evaluate(['/', 1, 2]), 0.5);
  assert.equal(evaluate(['*', ['/', 8, 4], ['+', 1, 1]]), 4);
});
