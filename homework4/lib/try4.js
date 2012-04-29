'use strict';
//var _ = require('underscore');

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
  switch (operator) {
  case '+':
    return evalScheem(operand1, env) + evalScheem(operand2, env);
  case '-':
    return evalScheem(operand1, env) - evalScheem(operand2, env);
  case '*':
    return evalScheem(operand1, env) * evalScheem(operand2, env);
  case '/':
    return evalScheem(operand1, env) / evalScheem(operand2, env);
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
    var result;
    expr.shift();
    expr.forEach(function (e) {
      result = evalScheem(e, env);
    });
    return result;
  default:
    throw new Error('unrecognized operator ' + operator);
  }
}

module.exports = evalScheem;
