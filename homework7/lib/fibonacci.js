'use strict';
var _ = require('underscore');

function fib(n) {
  if (n < 0) {
    throw new Error('cannot compute fibonnaci for negative numbers');
  }
  return n === 0 ? 0 : n === 1 ? 1 : fib(n - 1) + fib(n - 2);
}
 
/**
 * Returns the fibCPS of all positive integer values
 * equal to or less than a given positive integer.
 */
function fibCPS(n, cont) {
  if (n < 0) {
    throw new Error('cannot compute fibonnaci for negative numbers');
  } else if (n === 0) {
    return cont(0);
  } else if (n === 1) {
    return cont(1);
  } else {
    return fibCPS(n - 2, function (v1) {
      return fibCPS(n - 1, function (v2) {
        return cont(v1 + v2);
      });
    });
  }
}
 
function evalThunk(thk) {
  var tag = thk.tag;
  if (tag === 'value') {
    return thk.val;
  }
  if (tag === "thunk") {
    var subExpr = thk.func.apply(null, thk.args);
    return evalThunk(subExpr);
  }
  throw new Error('invalid thunk tag "' + tag + '"');
}

function thunk(f, lst) {
  return {tag: 'thunk', func: f, args: lst};
}

function fibThunk(n, cont) {
  if (n < 0) {
    throw new Error('cannot compute fibonnaci for negative numbers');
  } else if (n === 0) {
    return thunk(cont, [0]);
  } else if (n === 1) {
    return thunk(cont, [1]);
  } else {
    return thunk(fibThunk, [n - 2, function (v1) {
      return thunk(fibThunk, [n - 1, function (v2) {
        return thunk(cont, [v1 + v2]);
      }]);
    }]);
  }
}

function trampoline(thk) {
  while (true) {
    var tag = thk.tag;
    //console.log('trampoline: tag =', tag);
    if (tag === 'value') {
      return thk.val;
    } else if (tag === "thunk") {
      thk = thk.func.apply(null, thk.args);
    } else {
      throw new Error('invalid thunk tag "' + tag + '"');
    }
  }
}

function thunkValue(x) {
  return {tag: 'value', val: x};
}

function fibTrampoline(n) {
  var thk = fibThunk(n, thunkValue);
  //console.log('fibTrampoline: thk =', thk);
  return trampoline(thk);
}

exports.evalThunk = evalThunk;
exports.fib = fib;
exports.fibCPS = fibCPS;
exports.fibThunk = fibThunk;
exports.fibTrampoline = _.memoize(fibTrampoline);
exports.thunk = thunk;
exports.thunkValue = thunkValue;
