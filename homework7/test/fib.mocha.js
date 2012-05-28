'use strict';
var assert = require('chai').assert;
var fibonacci = require('../lib/fibonacci');
var fib = fibonacci.fib;
var fibCPS = fibonacci.fibCPS;
var fibThunk = fibonacci.fibThunk;
var fibTrampoline = fibonacci.fibTrampoline;
var evalThunk = fibonacci.evalThunk;
var thunk = fibonacci.thunk;
var thunkValue = fibonacci.thunkValue;
var util = require('util');

test('fib', function () {
  assert.equal(fib(0), 0);
  assert.equal(fib(1), 1);
  assert.equal(fib(2), 1);
  assert.equal(fib(3), 2);
  assert.equal(fib(4), 3);
  assert.equal(fib(5), 5);
  assert.equal(fib(6), 8);
  assert.equal(fib(7), 13);
});

test('fibCPS', function () {
  fibCPS(1, function (result) {
    assert.equal(result, 1);
  });
  fibCPS(3, function (result) {
    assert.equal(result, 2);
  });
  fibCPS(7, function (result) {
    assert.equal(result, 13);
  });
});

test('fibThunk', function () {
  assert.equal(evalThunk(fibThunk(0, thunkValue)), 0);
  assert.equal(evalThunk(fibThunk(1, thunkValue)), 1);
  assert.equal(evalThunk(fibThunk(2, thunkValue)), 1);
  assert.equal(evalThunk(fibThunk(3, thunkValue)), 2);
  assert.equal(evalThunk(fibThunk(4, thunkValue)), 3);
  assert.equal(evalThunk(fibThunk(5, thunkValue)), 5);
  assert.equal(evalThunk(fibThunk(6, thunkValue)), 8);
  assert.equal(evalThunk(fibThunk(7, thunkValue)), 13);
});

test('fibTrampoline', function () {
  assert.equal(fibTrampoline(0), 0);
  assert.equal(fibTrampoline(1), 1);
  assert.equal(fibTrampoline(2), 1);
  assert.equal(fibTrampoline(3), 2);
  assert.equal(fibTrampoline(4), 3);
  assert.equal(fibTrampoline(5), 5);
  assert.equal(fibTrampoline(6), 8);
  assert.equal(fibTrampoline(7), 13);
  assert.equal(fibTrampoline(30), 832040);
  // This takes too long!
  //assert.equal(fibTrampoline(50), 12586269025);
});
