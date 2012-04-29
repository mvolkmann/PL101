'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try6');

test('try6', function () {
  var env = {};
  assert.equal(evalScheem(['=', 2, ['+', 1, 1]], env), '#t');
  assert.equal(evalScheem(['+', 2, 3], env), 5);
  assert.equal(evalScheem(['<', 2, 2], env), '#f');
  assert.equal(evalScheem(['<', 2, 3], env), '#t');
  assert.equal(evalScheem(['<', ['+', 1, 1], ['+', 2, 3]], env), '#t');
});
