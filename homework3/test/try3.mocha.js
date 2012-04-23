'use strict';

var assert = require('chai').assert;
var parser = require('../lib/try3');

test('try3', function () {
  assert.equal(parser.parse('FOO'), 'FOO');
  assert.equal(parser.parse('bar'), 'bar');
});
