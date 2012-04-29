'use strict';
//var _ = require('underscore');

function evalScheem(expr) {
  //if (_.isNumber(expr)) {
  if (typeof expr === 'number') {
    return expr;
  }

  var operator = expr[0];
  var operand1 = expr[1];
  var operand2 = expr[2];
  switch (operator) {
  case '+':
    return evalScheem(operand1) + evalScheem(operand2);
  case '-':
    return evalScheem(operand1) - evalScheem(operand2);
  case '*':
    return evalScheem(operand1) * evalScheem(operand2);
  case '/':
    return evalScheem(operand1) / evalScheem(operand2);
  }
}

module.exports = evalScheem;
