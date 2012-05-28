'use strict';

/**
 * Returns the product of all positive integer values
 * equal to or less than a given positive integer.
 */
function factorialCPS(n, cont) {
  if (n <= 1) {
    return cont(1);
  } else {
    var newCont = function (v) {
      return cont(v * n);
    };
    return factorialCPS(n - 1, newCont);
  }
}

function thunk(f, lst) {
  return {tag: 'thunk', func: f, args: lst};
}

function factorialThunk(n, cont) {
  if (n <= 1) {
    return thunk(cont, [1]);
  } else {
    var newCont = function (v) {
      return thunk(cont, [v * n]);
    };
    return thunk(factorialThunk, [n - 1, newCont]);
  }
}

exports.factorialCPS = factorialCPS;
exports.factorialThunk = factorialThunk;
exports.thunk = thunk;
