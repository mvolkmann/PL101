'use strict';
var assert = require('chai').assert;
var parse = require('../parser').parse;

var tortoise = require('../tortoise');
var evalExpr = tortoise.evalExpr;
var evalStatement = tortoise.evalStatement;

/*
 * This test doesn't work now that the grammar
 * requires statements, not just expressions.
test('try2', function () {
  assert.equal(parse('19'), 19);
  assert.equal(parse('3.14'), 3.14);
  assert.equal(parse('-19'), -19);
  assert.equal(parse('-3.14'), -3.14);
  //assert.equal(parse('foo'), undefined);
});
*/

/*
 * This test doesn't work now that the grammar
 * requires statements, not just expressions.
test('try3', function () {
  assert.equal(parse('42'), 42);
  assert.deepEqual(parse('x'), [{tag: 'ident', name: 'x'}]);
  assert.deepEqual(parse('abc'), [{tag: 'ident', name: 'abc'}]);
});
*/

test('try4', function () {
  assert.deepEqual(parse('x:=EXPR;'),
    [{tag: ':=', left: 'x', right: 'EXPR'}]);
  assert.deepEqual(parse('var x;'), [{tag: 'var', name: 'x'}]);
  assert.deepEqual(parse('if(EXPR){}'),
    [{tag: 'if', expr: 'EXPR', body: []}]);
  assert.deepEqual(parse('if(EXPR){x:=EXPR;}'),
    [{tag: 'if', expr: 'EXPR', body: [
      {tag: ':=', left: 'x', right: 'EXPR'}
    ]}]);
  assert.deepEqual(parse('repeat(EXPR){x:=EXPR;}'),
    [{tag: 'repeat', expr: 'EXPR', body: [
      {tag: ':=', left: 'x', right: 'EXPR'}
    ]}]);
});

test('try5', function () {
  var env = {bindings: {x: 2, y: 3}, outer: {}};
  assert.deepEqual(
    evalExpr({tag: '+', left: 3, right: 5}, env), 8);
  assert.deepEqual(evalExpr(
    {
      tag: '+',
      left: {tag: 'ident', name: 'x'},
      right: 5
    },
    env),
    7);
  assert.deepEqual(evalExpr(
    {
      tag: '+',
      left: {tag: 'ident', name: 'x'},
      right: {tag: 'ident', name: 'y'}
    },
    env),
    5);
});

test('try6', function () {
  assert.equal(evalStatement({tag: "ignore", body: 3}, {}), 3);
  assert.deepEqual(evalStatement(
    {
      tag: "repeat",
      expr: 5,
      body: [{tag: "ignore", body: 3}]
    },
    {}),
    3);
  //assert.equal(count, 5);
});

test('function calls', function () {
  assert.deepEqual(parse(' forward(100); '), [
    {
      tag: 'ignore',
      body: {
        tag: 'call',
        name: 'forward',
        args: [100]
      }
    }
  ]);
});
