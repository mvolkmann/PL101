'use strict';
/*global module: false */

function evalScheem(expr, env) {
  if (!env) {
    env = {};
  }

  //if (_.isNumber(expr)) {
  if (typeof expr === 'number') {
    return expr;
  }

  //if (_.isString(expr)) {
  if (typeof expr === 'string') {
    return env[expr];
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
    env[operand1] = evalScheem(operand2);
    return 0;
  case 'set!':
    if (!env[operand1]) {
      throw new Error('variable ' + operand1 + ' is not defined');
    }
    env[operand1] = evalScheem(operand2, env);
    return 0;
  case 'begin':
    expr.shift();
    expr.forEach(function (e) {
      result = evalScheem(e, env);
    });
    return result;
  case 'quote':
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
  default:
    throw new Error('unrecognized operator ' + operator);
  }
}

// If running in Node.js ...
if (typeof module !== undefined) {
  module.exports = evalScheem;
}
