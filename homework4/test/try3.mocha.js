'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try3');

test('try3', function () {
  var env = {'x': 5, 'y': 1};
  assert.equal(evalScheem('x', env), 5);
  assert.equal(evalScheem(['define', 'a', 5], env), 0);
  assert.equal(env.a, 5);
  assert.equal(evalScheem(['set!', 'a', 1], env), 0);
  assert.equal(env.a, 1);
  assert.equal(evalScheem(['set!', 'x', 7], env), 0);
  assert.equal(env.x, 7);
  assert.equal(evalScheem(['set!', 'y', ['+', 'x', 1]], env), 0);
  assert.equal(env.x, 7);
  assert.equal(env.y, 8);
});
