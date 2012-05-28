'use strict';

var evalDiv; // used before defined

function thunk(f) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  return {tag: 'thunk', func: f, args: args};
}

function lookup(env, v) {
  if (!(env.hasOwnProperty('bindings'))) {
    throw new Error(v + ' not found');
  }
  if (env.bindings.hasOwnProperty(v)) {
    return env.bindings[v];
  }
  return lookup(env.outer, v);
}

function update(env, v, val) {
  if (env.bindings.hasOwnProperty(v)) {
    env.bindings[v] = val;
  } else {
    update(env.outer, v, val);
  }
}

function evalExpr(expr, env, cont, xcont) {
  if (typeof expr === 'number') {
    return thunk(cont, expr);
  }

  if (typeof expr === 'string') {
    return thunk(cont, lookup(env, expr));
  }

  var fnName = expr[0];
  switch (fnName) {
  case '+':
    return thunk(evalExpr, expr[1], env, function (v1) {
      return thunk(evalExpr, expr[2], env, function (v2) {
        return thunk(cont, v1 + v2);
      }, xcont);
    }, xcont);
  case '*':
    return thunk(evalExpr, expr[1], env, function (v1) {
      return thunk(evalExpr, expr[2], env, function (v2) {
        return thunk(cont, v1 * v2);
      }, xcont);
    }, xcont);
  case '/':
    return evalDiv(expr[1], expr[2], env, cont, xcont);
  case 'set!':
    var name = expr[1];
    var valueExpr = expr[2];
    return thunk(evalExpr, valueExpr, env, function (v) {
      update(env, name, v);
      return thunk(cont, 0);
    });
  case 'throw':
    return thunk(xcont, 'EXCEPTION!');
  case 'try':
    var tryExpr = expr[1];
    var catchExpr = expr[2];
    // The function at end of the next line is only invoked if tryExpr throws.
    return thunk(evalExpr, tryExpr, env, cont, function (v) {
      // xcont is only invoked if catchExpr throws.
      return thunk(evalExpr, catchExpr, env, cont, xcont);
    });
  default:
    throw new Error('Unknown form');
  }
}

function evalDiv(top, bottom, env, cont, xcont) {
  return thunk(evalExpr, bottom, env, function (denominator) {
    if (denominator === 0) {
      // TODO: Is this really the best way to throw?
      var thk = thunk(evalExpr, ['throw'], env, cont, xcont);
      //console.log('evalDiv: throwing, thk =', thk);
      return thk;
    } else {
      return thunk(evalExpr, top, env, function (numerator) {
        return thunk(cont, numerator / denominator);
      }, xcont);
    }
  }, xcont);
}

function evalThunk(thk) {
  var tag = thk.tag;
  if (tag === 'value') {
    return thk.val;
  }
  if (tag === 'thunk') {
    var subExpr = thk.func.apply(null, thk.args);
    //console.log('sum evalThunk: subExpr =', subExpr);
    return evalThunk(subExpr);
  }
  throw new Error('invalid thunk tag "' + tag + '"');
}

function thunkValue(x) {
  return {tag: 'value', val: x};
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

function stepStart(expr, env) {
  return {
    data: evalExpr(expr, env, thunkValue),
    done: false
  };
}

function step(state) {
  var data = state.data;
  var tag = data.tag;
  if (tag === 'value') {
    state.data = data.val;
    state.done = true;
  } else if (tag === 'thunk') {
    state.data = data.func.apply(null, data.args);
  } else {
    throw new Error('invalid thunk tag "' + tag + '"');
  }
}

// Original version without using step.
/*
function evalFull(expr) {
  return trampoline(evalExpr(expr, {}, thunkValue));
}
*/

function evalFull(expr, env) {
  var state = stepStart(expr, env);
  while (!state.done) {
    step(state);
  }
  return state.data;
}

function evalTwo(expr1, expr2, env) {
  var state1 = stepStart(expr1, env);
  var state2 = stepStart(expr2, env);
  while (!state1.done || !state2.done) {
    if (!state1.done) {
      step(state1);
    }
    if (!state2.done) {
      step(state2);
    }
  }
}

exports.evalDiv = evalDiv;
exports.evalExpr = evalExpr;
exports.evalFull = evalFull;
exports.evalThunk = evalThunk;
exports.evalTwo = evalTwo;
exports.step = step;
exports.thunk = thunk;
exports.thunkValue = thunkValue;
exports.trampoline = trampoline;
