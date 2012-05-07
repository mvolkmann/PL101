'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try4');

test('try4', function () {
  var always3 = function (x) {
    return 3;
  };
  var identity = function (x) {
    return x;
  };
  var plusone = function (x) {
    return x + 1;
  };

  var env = {
    bindings: {
      'always3': always3,
      'identity': identity,
      'plusone': plusone
    }
  };

  var expr = ['always3'];
  assert.equal(evalScheem(expr, env), 3);

  expr = ['identity', 2];
  assert.equal(evalScheem(expr, env), 2);

  expr = ['plusone', 2];
  assert.equal(evalScheem(expr, env), 3);

  assert.equal(evalScheem(
    ['plusone', ['always3']], env), 4);
  assert.equal(evalScheem(
    ['plusone', ['+', ['plusone', 2], ['plusone', 3]]], env), 8);
});
