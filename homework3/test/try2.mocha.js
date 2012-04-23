'use strict';

var assert = require('chai').assert;
var parser = require('../lib/try2');

test('try2', function () {
  assert.equal(parser.parse('ca'), 'ca');
});
