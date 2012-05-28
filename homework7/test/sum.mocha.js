'use strict';
var assert = require('chai').assert;
var sum = require('../lib/sum');
var sumCPS = sum.sumCPS;
var sumThunk = sum.sumThunk;
var sumTrampoline = sum.sumTrampoline;
var evalThunk = sum.evalThunk;
var thunk = sum.thunk;
var thunkValue = sum.thunkValue;

test('sumCPS', function () {
  sumCPS(1, function (result) {
    assert.equal(result, 1);
  });
  sumCPS(3, function (result) {
    assert.equal(result, 6);
  });
  sumCPS(4, function (result) {
    assert.equal(result, 10);
  });
});

test('sumThunk', function () {
  var actual = sumThunk(1, thunkValue);
  //console.log('actual =', actual);
  assert.deepEqual(actual, thunk(thunkValue, [1]));

  //console.log('evaled =', evalThunk(actual));

  actual = sumThunk(3, evalThunk);
  assert.equal(actual.func, sumThunk);
  assert.equal(actual.args[0], 2);
  var cont = actual.args[1];
  // sum of 1 and 2 is 3, plus 5 is 8
  assert.deepEqual(cont(5), thunk(evalThunk, [8]));
});

test('sumTrampoline', function () {
  assert.equal(sumTrampoline(1), 1);
  assert.equal(sumTrampoline(2), 3);
  assert.equal(sumTrampoline(3), 6);
  assert.equal(sumTrampoline(20000), 200010000);
});
