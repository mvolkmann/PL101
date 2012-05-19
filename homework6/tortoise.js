'use strict';

var evalStmt; // used before defined
var evalStmts; // used before defined
var lookup; // used before defined

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
  console.log('adding binding for', name);
  env.bindings[name] = value;
}

function evalStmt(stmt, env) {
  if (typeof stmt === 'number') {
    return stmt; // numbers evaluate to themselves
  }

  //console.log('evalStmt: tag =', stmt.tag);

  switch (stmt.tag) { // statements always have tags
  case 'ignore': // a single expression
    return evalStmt(stmt.body, env);
  case '+':
    return evalStmt(stmt.left, env) + evalStmt(stmt.right, env);
  case '-':
    return evalStmt(stmt.left, env) - evalStmt(stmt.right, env);
  case '*':
    return evalStmt(stmt.left, env) * evalStmt(stmt.right, env);
  case '/':
    return evalStmt(stmt.left, env) / evalStmt(stmt.right, env);
  case '<':
    return evalStmt(stmt.left, env) < evalStmt(stmt.right, env);
  case '<=':
    return evalStmt(stmt.left, env) <= evalStmt(stmt.right, env);
  case '>':
    return evalStmt(stmt.left, env) > evalStmt(stmt.right, env);
  case '>=':
    return evalStmt(stmt.left, env) >= evalStmt(stmt.right, env);
  case 'call':
    var fn = lookup(env, stmt.name);
    var args = stmt.args.map(function (argObj) {
      return evalStmt(argObj, env);
    });
    return fn.apply(null, args);
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
  case 'ident':
    return lookup(env, stmt.name);
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
  case 'var':
    console.log('defined variable', stmt.name);
    addBinding(env, stmt.name, undefined);
    break;
  default:
    throw new Error('invalid tag "' + stmt.tag + '" passed to evalStmt');
  }

  return null;
}

function evalStmts(seq, env) {
  var result;
  for (var i = 0; i < seq.length; i++) {
    result = evalStmt(seq[i], env);
  }
  return result;
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

if (typeof exports !== 'undefined') {
  exports.addBinding = addBinding;
  exports.evalStmt = evalStmt;
  exports.evalStmts = evalStmts;
}
