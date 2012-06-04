'use strict';
var assert = require('chai').assert;
var tscheem = require('../lib/tscheem');
var arrow = tscheem.arrow;
var base = tscheem.base;
var prettyType = tscheem.prettyType;

test('prettyType', function () {
  assert.equal(prettyType(base('foo')), 'foo');
  assert.equal(prettyType(arrow('foo', 'bar')), '(foo -> bar)');
  assert.equal(prettyType(arrow('foo', arrow('bar', 'baz'))), '(foo -> (bar -> baz))');
});
