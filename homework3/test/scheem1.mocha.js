'use strict';

var assert = require('chai').assert;
var parser = require('../lib/scheem1');

test('scheem1', function () {
  assert.deepEqual(
    parser.parse('( + 1 2 ) '),
    [['+', '1', '2']]);
  assert.deepEqual(
    parser.parse('(+ 1\n (* x 3))'),
    [['+', '1', ['*', 'x', '3']]]);
  assert.deepEqual(
    parser.parse('\t( * n\n(  \t  factorial \n (- n 1) ) ) '),
    [['*', 'n', ['factorial', ['-', 'n', '1']]]]);
  assert.deepEqual(parser.parse("'x"), [['quote', 'x']]);
  assert.deepEqual(parser.parse("'(1 2 3)"), [['quote', ['1', '2', '3']]]);
  var lines =
    ';; This is a comment.\n' +
    '(foo bar baz)\n' +
    ';; This is another comment.\n';
  assert.deepEqual(
    parser.parse(lines),
    [['foo', 'bar', 'baz']]);
});
