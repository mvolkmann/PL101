'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try5');

test('try5', function () {
  var env = {bindings: {}};
  assert.equal(evalScheem(
    [['lambda-one', 'x', 'x'], 5], env), 5);
  assert.equal(evalScheem(
    [['lambda-one', 'x', ['+', 'x', 1]], 5], env), 6);
  assert.equal(evalScheem(
    [[['lambda-one', 'x',
       ['lambda-one', 'y', ['+', 'x', 'y']]], 5], 3], env), 8);
  assert.equal(evalScheem(
    [[['lambda-one', 'x',
       ['lambda-one', 'x', ['+', 'x', 'x']]], 5], 3], { }), 6);
});
