'use strict';

// Functions that are used before they are defined:
var evalStmt;
var evalStmts;
var lookup;
var step;
var stepStart;
var thunk;
var thunkValue;

var reservedWords = [
  'alert', 'begin', 'car', 'cat', 'cdr', 'cons',
  'define', 'emptyp', 'exit', 'if', 'lambda',
  'length', 'let-one', 'list'
];

function addBinding(env, name, value) {
  if (reservedWords.indexOf(name) !== -1) {
    throw new Error('cannot bind to a reserved word');
  }
  if (!env.hasOwnProperty('bindings')) {
    env.bindings = {};
    env.outer = {};
  }
  //console.log('adding binding for', name);
  env.bindings[name] = value;
}

function evalFull(expr, env) {
  var state = stepStart(expr, env);
  while (!state.done) {
    step(state);
  }
  return state.data;
}

function evalStmt(stmt, env, cont, xcont) {
  if (!cont) {
    throw new Error('call to evalStmt missing cont argument');
  }

  if (typeof stmt === 'number') {
    //return stmt; // numbers evaluate to themselves
    cont(stmt); // numbers evaluate to themselves
    return;
  }

  //console.log('evalStmt: tag =', stmt.tag);

  switch (stmt.tag) { // statements always have tags
  case 'ignore': // a single expression
    evalStmt(stmt.body, env, function (value) {
      cont(value);
    }, xcont);
    break;
  case '+':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue + rightValue);
      }, xcont);
    });
    break;
  case '-':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue - rightValue);
      }, xcont);
    });
    break;
  case '*':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue * rightValue);
      }, xcont);
    });
    break;
  case '/':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue / rightValue);
      }, xcont);
    });
    break;
  case '<':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue < rightValue);
      }, xcont);
    });
    break;
  case '<=':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue <= rightValue);
      }, xcont);
    });
    break;
  case '>':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue > rightValue);
      }, xcont);
    });
    break;
  case '>=':
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue >= rightValue);
      }, xcont);
    });
    break;
  case 'call':
    var fn = lookup(env, stmt.name);
    var args = [];
    stmt.args.forEach(function (argObj) {
      evalStmt(argObj, env, function (value) {
        args.push(value);
      }, xcont);
    });
    //return fn.apply(null, args);
    cont(fn.apply(null, args));
    break;
  /*
  case 'define': // name args body
    console.log('defining function', stmt.name, 'with args', stmt.args);
    var newFunc = function () { // takes any number of arguments
      var newBindings;
      newBindings = {};
      for (var i = 0; i < stmt.args.length; i++) {
        newBindings[stmt.args[i].name] = arguments[i];
      }
      var newEnv = {bindings: newBindings, outer: env};
      return evalStmts(stmt.body, newEnv);
    };
    addBinding(env, stmt.name, newFunc);
    break;
  */
  case 'ident':
    //return lookup(env, stmt.name);
    cont(lookup(env, stmt.name));
    break;
  case ':=':
    var name = stmt.left;
    evalStmt(stmt.right, env, function (rhs) {
      addBinding(env, name, rhs);
      cont(rhs);
    }, xcont);
    //return rhs;
    break;
  /*
  case 'if':
    if (evalStmt(stmt.expr, env)) {
      evalStmts(stmt.body, env);
    }
    break;
  case 'repeat':
    var times = evalStmt(stmt.expr);
    var body = stmt.body;
    var result;
    for (var i = 0; i < times; i++) {
      result = evalStmts(body, env);
    }
    return result;
  */
  case 'var':
    console.log('defined variable', stmt.name);
    addBinding(env, stmt.name, undefined);
    cont();
    break;
  default:
    throw new Error('invalid tag "' + stmt.tag + '" passed to evalStmt');
  }

  return null;
}

function evalStmts(stmts, env, cont, xcont) {
  console.log('tortoise evalStmts: stmts =', stmts);
  var len = stmts.length;
  var i = 0;

  var newCont = function (fn) {
    return i < len ?
      thunk(evalStmt, stmts[i++], env, newCont, xcont) :
      thunk(cont, fn);
  };

  return newCont(undefined);
}

function lookup(env, v) {
  if (!(env.hasOwnProperty('bindings'))) {
    throw new Error(v + " not found");
  }

  if (env.bindings.hasOwnProperty(v)) {
    return env.bindings[v];
  }

  return lookup(env.outer, v);
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

/**
 * Returns a state object representing the result of a given expression
 * which is typically the first expression in a sequence.
 */
function stepStart(expr, env) {
  return {
    data: evalStmt(expr, env, thunkValue),
    done: false
  };
}

function thunk(f) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  return {tag: 'thunk', func: f, args: args};
}

function thunkValue(x) {
  return {tag: 'value', val: x};
}

function trampoline(thk) {
  while (true) {
    console.log('tortoise evalThunk: thk =', thk);
    var tag = thk.tag;
    console.log('tortoise evalThunk: tag =', tag);
    if (tag === 'value') {
      return thk.val;
    }
    if (tag === 'thunk') {
      var fn = thk.func;
      console.log('tortoise evalThunk: fn.name =', fn.name);
      console.log('tortoise evalThunk: thk.args =', thk.args);
      fn.apply(null, thk.args);
      // TODO: Need to assign new value to thk!
    } else {
      throw new Error('invalid thunk tag "' + tag + '"');
    }
  }
}

if (typeof exports !== 'undefined') {
  exports.addBinding = addBinding;
  exports.evalStmt = evalStmt;
  exports.evalStmts = evalStmts;
}
