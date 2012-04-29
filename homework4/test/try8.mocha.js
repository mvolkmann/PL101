'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try8');

test('try8', function () {
  var env = {'error': -1};
  var error = 'error';
  assert.equal(evalScheem(['if', ['=', 1, 1], 2, 3], env), 2);
  assert.equal(evalScheem(['if', ['=', 1, 0], 2, 3], env), 3);
  assert.equal(evalScheem(['if', ['=', 1, 1], 2, error], env), 2);
  assert.equal(evalScheem(['if', ['=', 1, 1], error, 3], env), env.error);
  assert.equal(evalScheem(['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12], env), 11);
});
