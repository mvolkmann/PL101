'use strict';
/*global module: false */

var lookup; // defined later
var quote; // defined later

function evalAtom(atom, env) {
  if (/^\d+$/.test(atom)) {
    return parseInt(atom, 10);
  } else if (/^\d*\.\d+$/.test(atom)) {
    return parseFloat(atom);
  } else if (atom === '#t' || atom === '#f') {
    return atom;
  } else {
    var value = lookup(env, atom);
    if (!value) {
      throw new Error('undefined variable "' + atom + '"');
    }
    return value;
  }
}

function evalScheem(expr, env) {
  if (!env) {
    env = {bindings: {}};
  }

  if (typeof expr === 'number') {
    return expr;
  }

  if (typeof expr === 'string') {
    return evalAtom(expr, env);
  }

  var operator = expr[0];
  var operand1 = expr[1];
  var operand2 = expr[2];
  var lhs;
  var rhs;
  var result;

  switch (operator) {
  case '+':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    return lhs + rhs;
  case '-':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    return lhs - rhs;
  case '*':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    return lhs * rhs;
  case '/':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    return lhs / rhs;
  case 'define':
    env.bindings[operand1] = evalScheem(operand2);
    return 0;
  case 'set!':
    if (!env.bindings[operand1]) {
      throw new Error('variable "' + operand1 + '" is not defined');
    }
    env.bindings[operand1] = evalScheem(operand2, env);
    return 0;
  case 'begin':
    expr.shift();
    expr.forEach(function (e) {
      result = evalScheem(e, env);
    });
    return result;
  case 'quote':
    if (expr.length !== 2) {
      throw new Error('quote must have one argument');
    }
    return expr[1];
  case '=':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    return lhs === rhs ? '#t' : '#f';
  case '<':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    return lhs < rhs ? '#t' : '#f';
  case 'cons':
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    result = [lhs];
    result.push.apply(result, rhs);
    return result;
  case 'car':
    lhs = evalScheem(operand1, env);
    return lhs[0];
  case 'cdr':
    lhs = evalScheem(operand1, env);
    lhs.shift();
    return lhs;
  case 'if':
    if (expr.length !== 4) {
      throw new Error('if must have three arguments');
    }
    var condition = evalScheem(expr[1], env);
    var index = condition === '#t' ? 2 : 3;
    return evalScheem(expr[index], env);
  case 'let-one':
    var name = operand1;
    var value = evalScheem(operand2, env);
    var bindings = {};
    bindings[name] = value;
    var newEnv = {bindings: bindings, outer: env};
    var body = expr[3];
    return evalScheem(body, newEnv);
  default:
    var fn = evalScheem(operator, env);
    var args = [];
    if (operand1) {
      args.push(evalScheem(operand1, env));
    }
    return fn.apply(null, args);
  }
}

function lookup(env, name) {
  var bindings = env.bindings;
  if (bindings === undefined) {
    throw new Error('environment is missing bindings property');
  }

  var value = bindings[name];
  var outer = env.outer;
  return value || outer && lookup(outer, name) || null;
}

module.exports = evalScheem;
