'use strict';

// Functions that are used before they are defined:
var evalStmts;
var lookup;
var operands;
var thunk;

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

function evalExpr(expr, env, cont) {
  if (!cont) {
    throw new Error('call to evalExpr missing cont argument');
  }

  if (typeof expr === 'number') {
    return cont(expr); // numbers evaluate to themselves
  }

  //console.log('tortoise evalExpr: expr.tag =', expr.tag);
  switch (expr.tag) { // statements always have tags
  case '+':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs + rhs;
    });
  case '-':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs - rhs;
    });
  case '*':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs * rhs;
    });
  case '/':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs / rhs;
    });
  case '<':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs < rhs;
    });
  case '<=':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs <= rhs;
    });
  case '>':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs > rhs;
    });
  case '>=':
    return operands(expr, env, cont, function (lhs, rhs) {
      return lhs >= rhs;
    });
  case 'call':
    var fn = lookup(env, expr.name);
    /*
    var args = [];
    var i = 0;
    // Return a function that can be called repeatedly to
    // evaluate each function argument and then
    // evaluate the function itself using those arguments.
    var evalArgs = function (arg) {
      args.push(arg);
      // If all the arguments have been evaluated ...
      if (i === expr.args.length) {
        return fn.apply(this, args);
      } else {
        var nextArg = expr.args[i++];
        return thunk(evalExpr, nextArg, env, evalArgs);
      }
    };
    return evalArgs(cont);
    */
    // TODO: This version only handles function calls with one argument!
    // See http://nathansuniversity.com/vanilla/discussion/comment/1677#Comment_1677
    // for hints on how to improve this.
    return evalExpr(expr.args[0], env, function (arg) {
      return cont(fn.apply(this, [arg]));
    });
    
  case 'ident':
    return thunk(cont, lookup(env, expr.name));
  default:
    throw new Error('tortoise evalExpr: unhandled tag', expr.tag);
  }

  return null; // happens when tag is 'ignore'
}

function evalStmt(stmt, env, cont) {
  switch (stmt.tag) {
  case 'ignore': // a single expression
    return evalExpr(stmt.body, env, cont);
  case ':=':
    var name = stmt.left;
    return evalExpr(stmt.right, env, function (rhs) {
      addBinding(env, name, rhs);
      return thunk(cont, rhs);
    });
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
  /*
  case 'if':
    if (evalExpr(stmt.expr, env)) {
      evalStmts(stmt.body, env);
    }
    break;
  case 'repeat':
    var times = evalExpr(stmt.expr);
    var body = stmt.body;
    var result;
    for (var i = 0; i < times; i++) {
      result = evalStmts(body, env);
    }
    return result;
  */
  case 'var':
    // TODO: Does your parser support initialization values?
    return evalExpr(stmt.initial, env, function (val) {
      addBinding(env, stmt.name, val);
      return thunk(cont, 0); // TODO: Why using zero?
    });
  default:
    throw new Error('invalid tag "' + stmt.tag + '" passed to evalStmt');
  }
}

function evalStmts(stmts, env, cont) {
  var len = stmts.length;
  var i = 0;

  var newCont = function (value) {
    return i < len ?
      thunk(evalStmt, stmts[i++], env, newCont) :
      thunk(cont, value);
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

function operands(expr, env, cont, cb) {
  return thunk(
    evalExpr, expr.left, env,
    function (lhs) {
      return thunk(
        evalExpr, expr.right, env,
        function (rhs) {
          if (typeof lhs !== 'number' || typeof rhs !== 'number') {
            throw 'arguments to ' + expr.tag + ' must be numbers';
          }
          return thunk(cont, cb(lhs, rhs));
        });
    });
}

/**
 * Returns a thunk built from a given function and any number of arguments.
 */
function thunk(f) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  return {tag: 'thunk', func: f, args: args};
}

function thunkValue(x) {
  return {tag: 'value', val: x};
}
