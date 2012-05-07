'use strict';
/*global module: false */

var lookup; // defined later
var quote; // defined later
var set; // defined later
var setBinding; // defined later

// If running in Node.js ...
if (typeof module !== 'undefined') {
  var parser = require('../scheemParser');
  //var _ = require('underscore');
}

function addBinding(env, name, value) {
  //console.log('addBinding: name =', name, ', value =', value);
  env.bindings[name] = value;
}

function evalAtom(atom, env) {
  //console.log('evalAtom: atom =', atom);
  //console.log('evalAtom: env =', env);
  if (/^\d+$/.test(atom)) {
    //console.log('evalAtom: got integer');
    return parseInt(atom, 10);
  } else if (/^\d*\.\d+$/.test(atom)) {
    //console.log('evalAtom: got float');
    return parseFloat(atom);
  } else if (atom === '#t' || atom === '#f') {
    //console.log('evalAtom: got boolean');
    return atom;
  } else {
    var value = lookup(env, atom);
    //console.log('evalAtom: value =', value);
    if (value === undefined) {
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

  var body;
  var fn;
  var i;
  var operator = expr[0];
  var operand1 = expr[1];
  var operand2 = expr[2];
  var len = expr.length;
  var lhs;
  var name;
  var rhs;
  var result;

  switch (operator) {
  case '+':
    result = 0;
    for (i = 1; i < len; i++) {
      result += evalScheem(expr[i], env);
    }
    return result;
  case '-':
    result = evalScheem(expr[1], env);
    for (i = 2; i < len; i++) {
      result -= evalScheem(expr[i], env);
    }
    return result;
  case '*':
    result = evalScheem(expr[1], env);
    for (i = 2; i < len; i++) {
      result *= evalScheem(expr[i], env);
    }
    return result;
  case '/':
    result = evalScheem(expr[1], env);
    for (i = 2; i < len; i++) {
      result /= evalScheem(expr[i], env);
    }
    return result;
  case 'define':
    //console.log('define: name =', operand1,
    //  ', value =', operand2);
    addBinding(env, operand1, evalScheem(operand2, env));
    return 0;
  case 'set!':
    //console.log('in set! case, operand1 =', operand1);
    //console.log('in set! case, operand2 =', operand2);
    setBinding(env, operand1, evalScheem(operand2, env));
    return 0;
  case 'begin':
    expr.shift();
    expr.forEach(function (e) {
      //console.log('\nbegin: evaluating', e);
      result = evalScheem(e, env);
      //console.log('begin: result =', result);
    });
    return result;
  case 'quote':
    if (expr.length !== 2) {
      throw new Error('quote must have one argument');
    }
    return expr[1];
  case '=':
    //console.log('=: operand1 =', operand1);
    //console.log('=: env =', env);
    lhs = evalScheem(operand1, env);
    rhs = evalScheem(operand2, env);
    //console.log('=: lhs =', lhs, ', rhs =', rhs);
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
    var newEnv = {bindings: {}, outer: env};
    addBinding(newEnv, operand1, evalScheem(operand2, env));
    body = expr[3];
    return evalScheem(body, newEnv);
  case 'lambda':
    var argNames = [];
    for (i = 1; i < len; i++) {
      argNames.push(expr[i]);
    }
    body = expr[len - 1];
    return function () {
      var newEnv = {bindings: {}, outer: env};
      for (var i = 0; i < arguments.length; i++) {
        var name = argNames[i];
        var value = arguments[i];
        addBinding(newEnv, name, value);
      }
      //console.log('in lambda case, body =', newEnv);
      //console.log('in lambda case, newEnv =', newEnv);
      return evalScheem(body, newEnv);
    };
  case 'lambda-one':
    var argName = operand1;
    body = operand2;
    return function (argValue) {
      var newEnv = {bindings: {}, outer: env};
      addBinding(newEnv, argName, argValue);
      return evalScheem(body, newEnv);
    };
  default:
    //console.log('\nin default case, operator =', operator);
    fn = evalScheem(operator, env);
    //console.log('in default case, fn =', fn);
    //console.log('in default case, env =', env);
    var args = [];
    for (i = 1; i < len; i++) {
      var arg = expr[i];
      args.push(evalScheem(arg, env));
    }
    //console.log('in default case, args =', args);
    return fn.apply(null, args);
  }
}

function evalScheemString(s, env) {
  env = env || {bindings: {}};
  //console.log('s = "' + s + '"');
  var exprs = parser.parse(s);
  var result;
  exprs.forEach(function (expr) {
    //console.log('evaluating', expr);
    result = evalScheem(expr, env);
  });

  return Array.isArray(result) ? quote(result) : result;
}

function lookup(env, name) {
  var bindings = env.bindings;
  if (bindings === undefined) {
    throw new Error('environment is missing bindings property');
  }

  var value = bindings[name];
  var outer = env.outer;
  return value !== undefined ? value :
    outer ? lookup(outer, name) :
    undefined;
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

function getBindings(env, name) {
  var bindings = env.bindings;
  var value = bindings[name];
  var outer = env.outer;
  return value !== undefined ? bindings :
    outer ? getBindings(outer, name) : null;
}

function set(name, expr, env) {
  var bindings = getBindings(env, name);
  if (!bindings) {
    throw new Error('variable "' + name + '" is not defined');
  }
  bindings[name] = evalScheem(expr, env);
}

function setBinding(env, name, value) {
  //console.log('setBinding: name =', name, 'value =', value);
  var bindings = env.bindings;
  var currValue = bindings[name];
  if (currValue) {
    bindings[name] = value;
  } else {
    var outer = env.outer;
    if (outer) {
      setBinding(outer, name, value);
    } else {
      throw new Error('variable "' + name + '" is not defined');
    }
  }
}

// If running in Node.js ...
if (typeof module !== 'undefined') {
  exports.evalScheem = evalScheem;
  exports.evalScheemString = evalScheemString;
  exports.lookup = lookup;
}
