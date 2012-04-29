'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try2');

test('try2', function () {
  assert.equal(evalScheem(5), 5);
  assert.equal(evalScheem('x', {'x': 5}), 5);
  assert.equal(evalScheem(['+', 2, 3]), 5);
  assert.equal(evalScheem(['*', 'y', 3], {y: 2}), 6);
  assert.equal(evalScheem(['/', 'z', ['+', 'x', 'y']], {x: 1, y: 2, z: 3}), 1);
});
