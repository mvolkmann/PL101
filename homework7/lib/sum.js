'use strict';

/**
 * Returns the sumCPS of all positive integer values
 * equal to or less than a given positive integer.
 */
function sumCPS(n, cont) {
  if (n <= 1) {
    return cont(1);
  } else {
    var newCont = function (v) {
      return cont(v + n);
    };
    return sumCPS(n - 1, newCont);
  }
}
 
function evalThunk(thk) {
  var tag = thk.tag;
  if (tag === 'value') {
    return thk.val;
  }
  if (tag === 'thunk') {
    var subExpr = thk.func.apply(null, thk.args);
    console.log('sum evalThunk: subExpr =', subExpr);
    return evalThunk(subExpr);
  }
  throw new Error('invalid thunk tag "' + tag + '"');
}

function thunk(f, lst) {
  return {tag: 'thunk', func: f, args: lst};
}

function sumThunk(n, cont) {
  if (n <= 1) {
    // Pass arguments in 2nd arg array to 1st arg function.
    return thunk(cont, [1]);
  } else {
    var newCont = function (v) {
      return thunk(cont, [v + n]);
    };
    return thunk(sumThunk, [n - 1, newCont]);
  }
}

function trampoline(thk) {
  while (true) {
    var tag = thk.tag;
    //console.log('trampoline: tag =', tag);
    if (tag === 'value') {
      return thk.val;
    } else if (tag === 'thunk') {
      thk = thk.func.apply(null, thk.args);
    } else {
      throw new Error('invalid thunk tag "' + tag + '"');
    }
  }
}

function thunkValue(x) {
  return {tag: 'value', val: x};
}

function sumTrampoline(n) {
  var thk = sumThunk(n, thunkValue);
  //console.log('sumTrampoline: thk =', thk);
  return trampoline(thk);
}

exports.evalThunk = evalThunk;
exports.sumCPS = sumCPS;
exports.sumThunk = sumThunk;
exports.sumTrampoline = sumTrampoline;
exports.thunk = thunk;
exports.thunkValue = thunkValue;
