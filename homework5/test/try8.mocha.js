'use strict';

var assert = require('chai').assert;
var evalScheemString = require('../lib/try8').evalScheemString;

test('try8', function () {
  var env = {bindings: {}};

  var expr = '(+ 1 2)';
  var result = evalScheemString(expr, env);
  assert.equal(result, 3);

  expr = '(begin ' +
    '  (define x 1) ' +
    '  (+ x 2))';
  result = evalScheemString(expr, env);
  assert.equal(result, 3);

  expr = '(begin ' +
    '  (+ (+ 1 2 3) 4))';
  result = evalScheemString(expr, env);
  assert.equal(result, 10);

  expr = '(- 5 2)';
  result = evalScheemString(expr, env);
  assert.equal(result, 3);

  expr = '(* 2 3 4)';
  result = evalScheemString(expr, env);
  assert.equal(result, 24);

  expr = '(/ 24 3)';
  result = evalScheemString(expr, env);
  assert.equal(result, 8);
});
