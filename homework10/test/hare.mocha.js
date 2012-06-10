'use strict';
/*jshint evil: true */

var assert = require('chai').assert;
var hare = require('../lib/hare');
var compileEnvironment = hare.compileEnvironment;
var compileExpr = hare.compileExpr;
var compileStatement = hare.compileStatement;
var compileStatements = hare.compileStatements;
var app = hare.app;
var ign = hare.ign;
var op = hare.op;
var ref = hare.ref;
var rep = hare.rep;
var repeat = hare.repeat;

test('compileExpr', function () {
  assert.equal(eval(compileExpr(op('+', 1, 1))), 2);
  assert.equal(eval(compileExpr(op('-', 5, 1))), 4);
  assert.equal(eval(compileExpr(op('*', 2, 3))), 6);
  assert.isTrue(eval(compileExpr(op('<', 1, 2))));
  assert.isFalse(
    eval(compileExpr(op('<', op('+', op('*', 2, 3), 1), op('*', 3, 1)))));
});

test('compileEnvironment', function () {
  var env1 = [['x', 5], ['y', 100]];
  var env2 = [
    ['x', 7],
    ['f', function (x) {
      return 2 * x;
    }]
  ];

  assert.equal(
    eval(compileEnvironment(env1) + 'x'), 5);
  assert.equal(
    eval(compileEnvironment(env1) + 'y'), 100);
  assert.equal(
    eval(compileEnvironment(env2) + 'x'), 7);
  assert.equal(
    eval(compileEnvironment(env2) + 'f(x)'), 14);
});

test('compileCall', function () {
  var x = 5;
  function f(x) {
    return 3 * x + 1;
  }
  function g() {
    return 17;
  }
  function add(x, y) {
    return x + y;
  }

  assert.equal(
    eval(compileExpr(op('+', ref('x'), 1))), 6);
  assert.equal(
    eval(compileExpr(app('f', [3]))), 10);
  assert.equal(
    eval(compileExpr(app('g', []))), 17);
  assert.equal(
    eval(compileExpr(app('add', [2, 3]))), 5);
  assert.equal(
    eval(compileExpr(app('f', [app('f', [3])]))), 31);
});

test('compileStatement', function () {
  var x = 5;
  var prg1 = [ign(op('+', ref('x'), 1))];

  assert.equal(
    eval(compileStatements([ign(op('+', ref('x'), 1))], false) +
      ' _res'), 6);

  assert.equal(
    eval(compileStatements([ign(3), ign(op('+', ref('x'), 1))], false) +
      ' _res'), 6);

  assert.equal(
    eval(compileStatements([ign(op('+', ref('x'), 1)), ign(3)], false) +
      ' _res'), 3);

  assert.equal(
    eval('(function() {' +
      compileStatements([ign(op('+', ref('x'), 1)), ign(3)], true) +
      '})()'),
    3);
});

test('compileRepeat', function () {
  var x = 5;
  function f() {
    x += 1;
    return x;
  }

  var prg1 = rep(3, [ign(2)]);
  //console.log('prg1 =', prg1);
  //console.log(compileStatement(prg1));
  assert.equal(eval(compileStatement(prg1) + ' _res'), 2);

  var prg2 = rep(op('+', 2, 3), [ign(app('f', []))]);
  //console.log('prg2 =', prg2);
  //console.log('compiled =', compileStatement(prg2));
  assert.equal(eval(compileStatement(prg2) + ' _res'), 10);

  assert.equal(x, 10, 'x === 10');
});
