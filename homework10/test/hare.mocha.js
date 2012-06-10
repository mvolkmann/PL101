'use strict';
/*jshint evil: true */

var assert = require('chai').assert;
var hare = require('../lib/hare');
var compileExpr = hare.compileExpr;
var op = hare.op;

test('compileExpr', function () {
  assert.equal(eval(compileExpr(op('+', 1, 1))), 2);
  assert.equal(eval(compileExpr(op('-', 5, 1))), 4);
  assert.equal(eval(compileExpr(op('*', 2, 3))), 6);
  assert.isTrue(eval(compileExpr(op('<', 1, 2))));
  assert.isFalse(
    eval(compileExpr(op('<', op('+', op('*', 2, 3), 1), op('*', 3, 1)))));
});
