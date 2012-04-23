'use strict';

var assert = require('chai').assert;
var parser = require('../lib/try5');

test('try5', function () {
  assert.deepEqual(
    parser.parse('(+ 1 (* x 3))'),
    ['+', '1', ['*', 'x', '3']]);
  assert.deepEqual(
    parser.parse('(* n (factorial (- n 1)))'),
    ['*', 'n', ['factorial', ['-', 'n', '1']]]);
});
