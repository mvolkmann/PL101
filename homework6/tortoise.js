'use strict';

var evalStatement; // used before defined
var evalStatements; // used before defined
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
  env.bindings[name] = value;
}

var evalExpr = function (stmt, env) {
  if (typeof stmt === 'number') {
    return stmt; // numbers evaluate to themselves
  }

  switch (stmt.tag) {
  case '+':
    return evalExpr(stmt.left, env) + evalExpr(stmt.right, env);
  case '-':
    return evalExpr(stmt.left, env) - evalExpr(stmt.right, env);
  case '*':
    return evalExpr(stmt.left, env) * evalExpr(stmt.right, env);
  case '/':
    return evalExpr(stmt.left, env) / evalExpr(stmt.right, env);
  case '<':
    return evalExpr(stmt.left, env) < evalExpr(stmt.right, env);
  case '<=':
    return evalExpr(stmt.left, env) <= evalExpr(stmt.right, env);
  case '>':
    return evalExpr(stmt.left, env) > evalExpr(stmt.right, env);
  case '>=':
    return evalExpr(stmt.left, env) >= evalExpr(stmt.right, env);
  case 'call':
    var fn = lookup(env, stmt.name);
    return fn.apply(null, stmt.args);
  case 'define': // name args body
    var newFunc = function () { // takes any number of arguments
      var newBindings;
      newBindings = {};
      for (var i = 0; i < stmt.args.length; i++) {
        newBindings[stmt.args[i]] = arguments[i];
      }
      var newEnv = {bindings: newBindings, outer: env};
      return evalStatements(stmt.body, newEnv);
    };
    addBinding(env, stmt.name, newFunc);
    return null;
  case 'ident':
    return lookup(env, stmt.name);
  default:
    throw new Error('invalid tag "' + stmt.tag + '" passed to evalExpr');
  }
};

function evalStatement(stmt, env) {
  switch (stmt.tag) { // statements always have tags
  case 'ignore': // a single expression
    return evalExpr(stmt.body, env);
  case 'repeat':
    var times = evalExpr(stmt.expr);
    var body = stmt.body;
    var result;
    for (var i = 0; i < times; i++) {
      result = evalStatements(body, env);
    }
    return result;
  }
}

function evalStatements(seq, env) {
  var result;
  for (var i = 0; i < seq.length; i++) {
    result = evalStatement(seq[i], env);
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
  exports.evalExpr = evalExpr;
  exports.evalStatement = evalStatement;
  exports.evalStatements = evalStatements;
}
