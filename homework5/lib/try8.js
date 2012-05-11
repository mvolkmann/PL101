'use strict';
/*global module: false */

// These functions are defined after their first use.
var evalScheem;
var lookup;
var oneArg;
var quote;
var set;
var setBinding;
var twoArgs;

// If running in Node.js ...
if (typeof module !== 'undefined') {
  var parser = require('../scheemParser');
}

function addBinding(env, name, value) {
  //console.log('addBinding: name =', name, ', value =', value);
  env.bindings[name] = value;
}

function addBuiltins(env) {
  var bindings = env.bindings;

  bindings['+'] = function () {
    var result = 0;
    for (var i = 0; i < arguments.length; i++) {
      result += arguments[i];
    }
    return result;
  };

  bindings['-'] = function () {
    var result = arguments[0] || 0;
    for (var i = 1; i < arguments.length; i++) {
      result -= arguments[i];
    }
    return result;
  };

  bindings['*'] = function () {
    var result = arguments[0] || 0;
    for (var i = 1; i < arguments.length; i++) {
      result *= arguments[i];
    }
    return result;
  };

  bindings['/'] = function () {
    var result = arguments[0] || 0;
    for (var i = 1; i < arguments.length; i++) {
      result /= arguments[i];
    }
    return result;
  };

  bindings['='] = function () {
    twoArgs('=', arguments);
    return arguments[0] === arguments[1] ? '#t' : '#f';
  };

  bindings['<'] = function () {
    twoArgs('<', arguments);
    return arguments[0] < arguments[1] ? '#t' : '#f';
  };

  bindings['<='] = function () {
    twoArgs('<=', arguments);
    return arguments[0] <= arguments[1] ? '#t' : '#f';
  };

  bindings['>'] = function () {
    twoArgs('>', arguments);
    return arguments[0] > arguments[1] ? '#t' : '#f';
  };

  bindings['>='] = function () {
    twoArgs('>=', arguments);
    return arguments[0] >= arguments[1] ? '#t' : '#f';
  };

  bindings.begin = function () {
    var len = arguments.length;
    return arguments[len - 1];
  };

  bindings.car = function () {
    oneArg('car', arguments);
    var list = arguments[0];
    return list[0];
  };

  bindings.cdr = function () {
    oneArg('car', arguments);
    var list = arguments[0];
    list.shift();
    return list;
  };

  bindings.cons = function () {
    var result = [arguments[0]];
    result.push.apply(result, arguments[1]);
    return result;
  };
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
  var i;
  var len = expr.length;
  var operator = expr[0];
  var operand1 = expr[1];
  var operand2 = expr[2];

  switch (operator) {

  /*
  case 'begin':
    // It seems that this doesn't have to be a special form,
    // but keep this code until you're sure!
    var result;
    expr.shift();
    expr.forEach(function (e) {
      //console.log('\nbegin: evaluating', e);
      result = evalScheem(e, env);
      //console.log('begin: result =', result);
    });
    return result;
  */

  case 'define':
    // Must be a special form to avoid evaluating variable name.
    addBinding(env, operand1, evalScheem(operand2, env));
    return 0;

  case 'if':
    // Must be a special form to avoid evaluating
    // both the "then" and "else" arguments.
    if (len !== 4) {
      throw new Error('if must have three arguments');
    }
    var condition = evalScheem(expr[1], env);
    var index = condition === '#t' ? 2 : 3;
    return evalScheem(expr[index], env);

  case 'lambda':
    // Must be a special form to avoid evaluating parameter names.
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

  case 'let-one':
    // Must be a special form to avoid evaluating variable name.
    var newEnv = {bindings: {}, outer: env};
    addBinding(newEnv, operand1, evalScheem(operand2, env));
    body = expr[3];
    return evalScheem(body, newEnv);

  case 'quote':
    // Must be a special form to avoid evaluating first argument.
    if (len !== 2) {
      throw new Error('quote must have one argument');
    }
    return expr[1];

  case 'set!':
    // Must be a special form to avoid evaluating variable name.
    setBinding(env, operand1, evalScheem(operand2, env));
    return 0;

  default:
    var fn = evalScheem(operator, env);
    var args = [];
    for (i = 1; i < len; i++) {
      var arg = expr[i];
      args.push(evalScheem(arg, env));
    }
    return fn.apply(null, args);
  }
}

function evalScheemString(s, env) {
  env = env || {bindings: {}};
  addBuiltins(env);
  //console.log('s = "' + s + '"');
  var exprs = parser.parse(s);
  var result;
  exprs.forEach(function (expr) {
    //console.log('evaluating', expr);
    result = evalScheem(expr, env);
  });

  return Array.isArray(result) ? quote(result) : result;
}

function getBindings(env, name) {
  var bindings = env.bindings;
  var value = bindings[name];
  var outer = env.outer;
  return value !== undefined ? bindings :
    outer ? getBindings(outer, name) : null;
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

function oneArg(operator, args) {
  if (args.length !== 1) {
    throw new Error(operator + ' must have one argument');
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

function twoArgs(operator, args) {
  if (args.length !== 2) {
    throw new Error(operator + ' must have two arguments');
  }
}

// If running in Node.js ...
if (typeof module !== 'undefined') {
  exports.evalScheem = evalScheem;
  exports.evalScheemString = evalScheemString;
  exports.lookup = lookup;
}
