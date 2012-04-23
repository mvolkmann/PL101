'use strict';

var assert = require('chai').assert;
var parser = require('../lib/try7');

test('try7', function () {
  assert.deepEqual(
    parser.parse('1+2'),
    {tag: '+', left: 1, right: 2});
  assert.deepEqual(
    parser.parse('1+2*3'),
    {tag: '+', left: 1, right: {tag: '*', left: 2, right: 3}});
  assert.deepEqual(
    parser.parse('1,2'),
    {tag: ',', left: 1, right: 2});
  assert.deepEqual(
    parser.parse('1,2+3'),
    {tag: ',', left: 1, right: {tag: '+', left: 2, right: 3}});
  assert.deepEqual(
    parser.parse('1,2'),
    {tag: ',', left: 1, right: 2});
  assert.deepEqual(
    parser.parse('1*2,3'),
    {tag: ',', left: {tag: '*', left: 1, right: 2}, right: 3});
});
