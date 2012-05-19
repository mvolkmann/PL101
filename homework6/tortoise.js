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

var evalExpr = function (expr, env) {
  if (typeof expr === 'number') {
    return expr; // numbers evaluate to themselves
  }

  switch (expr.tag) {
  case '+':
    return evalExpr(expr.left, env) + evalExpr(expr.right, env);
  case '-':
    return evalExpr(expr.left, env) - evalExpr(expr.right, env);
  case '*':
    return evalExpr(expr.left, env) * evalExpr(expr.right, env);
  case '/':
    return evalExpr(expr.left, env) / evalExpr(expr.right, env);
  case '<':
    return evalExpr(expr.left, env) < evalExpr(expr.right, env);
  case '<=':
    return evalExpr(expr.left, env) <= evalExpr(expr.right, env);
  case '>':
    return evalExpr(expr.left, env) > evalExpr(expr.right, env);
  case '>=':
    return evalExpr(expr.left, env) >= evalExpr(expr.right, env);
  case 'define': // name args body
    var newFunc = function () { // takes any number of arguments
      var newBindings;
      newBindings = {};
      for (var i = 0; i < expr.args.length; i++) {
        newBindings[expr.args[i]] = arguments[i];
      }
      var newEnv = {bindings: newBindings, outer: env};
      return evalStatements(expr.body, newEnv);
    };
    addBinding(env, expr.name, newFunc);
    return null;
  case 'ident':
    return lookup(env, expr.name);
  default:
    throw new Error('invalid tag "' + expr.tag + '" passed to evalExpr');
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

if (exports) {
  exports.addBinding = addBinding;
  exports.evalExpr = evalExpr;
  exports.evalStatement = evalStatement;
  exports.evalStatements = evalStatements;
}
