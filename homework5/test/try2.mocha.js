'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/evalScheem').evalScheem;

test('try2', function () {
  var expr = ['let-one', 'x', 2, ['+', 'x', 1]];
  var env = {bindings: {}};
  assert.equal(evalScheem(expr, env), 3);

  expr = ['let-one', 'x', 2, ['+', 'x', 'y']];
  env = {bindings: {'y': 3}};
  assert.equal(evalScheem(expr, env), 5);

  expr = ['let-one', 'x', ['+', 'y', 1], ['+', 'x', 'y']];
  env = {bindings: {'y': 3}};
  assert.equal(evalScheem(expr, env), 7);

  expr = ['let-one', 'x', ['+', 'y', 'z'], ['+', 'x', 'y']];
  env = {bindings: {'y': 3}, outer: {bindings: {'z': 2}}};
  assert.equal(evalScheem(expr, env), 8);
});
