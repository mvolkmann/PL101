'use strict';
var assert = require('chai').assert;
var factorial = require('../lib/factorial');
var factorialCPS = factorial.factorialCPS;
var factorialThunk = factorial.factorialThunk;
var thunk = factorial.thunk;

test('factorial', function () {
  factorialCPS(1, function (result) {
    assert.equal(result, 1);
  });
  factorialCPS(3, function (result) {
    assert.equal(result, 6);
  });
  factorialCPS(4, function (result) {
    assert.equal(result, 24);
  });
});

test('factorialThunk', function () {
  function fn() {}
  var actual = factorialThunk(1, fn);
  assert.deepEqual(actual, thunk(fn, [1]));

  actual = factorialThunk(2, fn);
  assert.equal(actual.func, factorialThunk);
  assert.equal(actual.args[0], 1);
  var cont = actual.args[1];
  // factorial of 2 is 2, times 5 is 10 
  assert.deepEqual(cont(5), thunk(fn, [10]));
});
