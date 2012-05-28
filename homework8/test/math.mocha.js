'use strict';
var assert = require('chai').assert;
var math = require('../lib/math');
var evalDiv = math.evalDiv;
var evalFull = math.evalFull;
var evalTwo = math.evalTwo;
var step = math.step;
var thunk = math.thunk;
var thunkValue = math.thunkValue;
var trampoline = math.trampoline;

test('evalExpr', function () {
  assert.deepEqual(evalFull(['+', 1, 2]), 3);
});

test('step', function () {
  var state = {data: thunkValue(5), done: false};
  step(state);
  assert.deepEqual(state, {data: 5, done: true});

  var addOne = function (x) {
    return thunkValue(x + 1);
  };
  state = {data: thunk(addOne, 5), done: false};
  step(state);
  assert.equal(state.done, false);

  step(state);
  assert.equal(state.done, true);
  assert.equal(state.data, 6);
});

test('evalTwo', function () {
  var env = {bindings: {x: 3, y: 4}, outer: null};

  evalTwo(['set!', 'x', 7], ['set!', 'y', 10], env);
  assert.deepEqual(env, {bindings: {x: 7, y: 10}, outer: null});

  evalTwo(['set!', 'x', ['+', 1, 1]], ['set!', 'y', 11], env);
  assert.deepEqual(env, {bindings: {x: 2, y: 11}, outer: null});

  evalTwo(['set!', 'x', 13], ['set!', 'y', ['+', 2, 3]], env);
  assert.deepEqual(env, {bindings: {x: 13, y: 5}, outer: null});

  evalTwo(['set!', 'x', 15], ['set!', 'x', ['+', 10, 2]], env);
  assert.deepEqual(env, {bindings: {x: 12, y: 5}, outer: null});

  evalTwo(['set!', 'x', ['+', 3, 5]], ['set!', 'x', 17], env);
  assert.deepEqual(env, {bindings: {x: 8, y: 5}, outer: null});
});

test('evalDiv', function () {
  assert.equal(trampoline(evalDiv(1, 2, {}, thunkValue, thunkValue)), 0.5);
  assert.equal(
    trampoline(evalDiv(['throw'], 2, {}, thunkValue, thunkValue)),
    'EXCEPTION!');
  assert.equal(
    trampoline(evalDiv(1, ['throw'], {}, thunkValue, thunkValue)),
    'EXCEPTION!');
  assert.equal(
    trampoline(evalDiv(1, 0, {}, thunkValue, thunkValue)),
    'EXCEPTION!');
});
