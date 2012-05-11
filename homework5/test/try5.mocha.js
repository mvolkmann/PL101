'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/evalScheem').evalScheem;

test('try5', function () {
  var env = {bindings: {}};
  assert.equal(evalScheem(
    [['lambda', 'x', 'x'], 5], env), 5);
  assert.equal(evalScheem(
    [['lambda', 'x', ['+', 'x', 1]], 5], env), 6);
  assert.equal(evalScheem(
    [[['lambda', 'x',
       ['lambda', 'y', ['+', 'x', 'y']]], 5], 3], env), 8);
  assert.equal(evalScheem(
    [[['lambda', 'x',
       ['lambda', 'x', ['+', 'x', 'x']]], 5], 3], env), 6);
});
