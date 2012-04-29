'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try5');

test('try5', function () {
  var env = {};
  assert.equal(evalScheem(['+', 2, 3], env), 5);
  assert.deepEqual(evalScheem(['quote', ['+', 2, 3]], env), ['+', 2, 3]);
  assert.deepEqual(evalScheem(['quote', ['quote', ['+', 2, 3]]], env), ['quote', ['+', 2, 3]]);
});
