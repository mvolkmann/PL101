'use strict';
/*global module: false */

// If running in Node.js ...
if (typeof module !== undefined) {
  var parser = require('../scheemParser');
  //var _ = require('underscore');
}

function evalAtom(atom, env) {
  //console.log('evalAtom: atom =', atom);
  if (/^\d+$/.test(atom)) {
    //console.log('evalAtom: got integer');
    return parseInt(atom);
  } else if (/^\d*\.\d+$/.test(atom)) {
    //console.log('evalAtom: got float');
    return parseFloat(atom);
  } else if (atom === '#t' || atom === '#f') {
    //console.log('evalAtom: got boolean');
    return atom;
  } else {
    var value = env[atom];
    //console.log('evalAtom: value =', value);
    if (!value) {
      throw new Error('undefined variable "' + atom + '"');
    }
    return value;
  }
}

function quote(expr) {
  if (Array.isArray(expr)) {
    var s = '(';
    expr.forEach(function (subExpr) {
      s += quote(subExpr) + ' ';
    });

    // Remove trailing space and add right paren.
    s = s.slice(0, -1) + ')';

    return s;
  } else {
    return expr;
  }
}

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
  default:
    throw new Error('unrecognized operator ' + operator);
  }
}

function evalScheemString(s, env) {
  env = env || {};
  //console.log('s = "' + s + '"');
  var exprs = parser.parse(s);
  var result;
  exprs.forEach(function (expr) {
    //console.log('evaluating', expr);
    result = evalScheem(expr, env);
  });

  return Array.isArray(result) ? quote(result) : result;
}

// If running in Node.js ...
if (typeof module !== undefined) {
  exports.evalScheem = evalScheem;
  exports.evalScheemString = evalScheemString;
}
