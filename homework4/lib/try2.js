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
  }
}

module.exports = evalScheem;
