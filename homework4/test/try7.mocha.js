'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try7');

test('try7', function () {
  var env = {};
  assert.deepEqual(evalScheem(['quote', [2, 3]], env), [2, 3]);
  assert.deepEqual(evalScheem(['cons', 1, ['quote', [2, 3]]], env), [1, 2, 3]);
  assert.deepEqual(evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], env),
    [[1, 2], 3, 4]);
  assert.deepEqual(evalScheem(['car', ['quote', [[1, 2], 3, 4]]], env), [1, 2]);
  assert.deepEqual(evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], env), [3, 4]);
});
