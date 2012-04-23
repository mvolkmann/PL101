'use strict';

var assert = require('chai').assert;
var parser = require('../lib/try4');

test('try4', function () {
  assert.deepEqual(parser.parse('foo bar'), ['foo', 'bar']);
});
