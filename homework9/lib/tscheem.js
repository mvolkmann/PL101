'use strict';

var prettyType; // used before defined
var typeExpr; // used before defined

function app2(f, x, y) {
  return function (x, y) {
    return function (y) {
      return f(x)(y);
    };
  };
}

function arrow(left, right) {
  return {tag: 'arrowtype', left: left, right: right};
}

function base(name) {
  return {tag: 'basetype', name: name};
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

/*
function nestedPrettyType(type) {
  var pretty = prettyType(type);
  if (type.tag === 'arrowtype') {
    pretty = '(' + pretty + ')';
  }
  return pretty;
}
*/

function prettyType(type) {
  var tag = type.tag;
  switch (tag) {
  case 'arrowtype':
    //var left = nestedPrettyType(type.left);
    //var right = nestedPrettyType(type.right);
    var left = prettyType(type.left);
    var right = prettyType(type.right);
    return '(' + left + ' -> ' + right + ')';
  case 'basetype':
    return type.name;
  default:
    return type;
  }
}

function sameType(a, b, env) {
  return typeExpr(a, env) === typeExpr(b, env);
}

function typeExprIf(expr, env) {
  var cond = expr[1];
  //console.log('typeExprIf: cond =', cond);
  var condType = typeExpr(cond, env);
  //console.log('typeExprIf: condType =', condType);
  if (condType.name !== 'bool') {
    throw new Error('if requires a boolean condition');
  }

  var thenPart = expr[2];
  //console.log('typeExprIf: thenPart =', thenPart);
  var elsePart = expr[3];
  //console.log('typeExprIf: elsePart =', elsePart);

  var thenType = typeExpr(thenPart, env);
  //console.log('typeExprIf: thenType =', thenType);
  var elseType = typeExpr(elsePart, env);
  //console.log('typeExprIf: elseType =', elseType);

  return thenType.name === elseType.name ? thenType : undefined;
}

function typeExprArray(expr, env) {
  var fnName = expr[0];
  if (fnName === 'if') {
    return typeExprIf(expr, env);
  }

  var arg = expr[1];
  //console.log('callType: fnName =', fnName, ', arg =', arg);

  var fnType = typeExpr(fnName, env);
  var argType = typeExpr(arg, env);
  //console.log('callType: fnType =', fnType);
  //console.log('callType: argType =', argType);

  if (fnType.tag !== 'arrowtype') {
    throw new Error('not an arrow type');
  }

  // Verify argument type matches.
  var paramType = fnType.left;
  //console.log('callType: paramType =', paramType);
  //console.log('callType: argType =', argType);
  if (!sameType(paramType, argType)) {
    throw new Error('argument type did not match parameter type');
  }

  var returnType = fnType.right;
  return returnType;
}

function typeExpr(expr, env) {
  var t = typeof expr;
  //console.log('typeExpr: expr =', expr);
  //console.log('typeExpr: t =', t);
  return t === 'number' ?  {tag: 'basetype', name: 'num'} :
    t === 'boolean' ?  {tag: 'basetype', name: 'bool'} :
    t === 'string' ? lookup(env, expr) :
    Array.isArray(expr) ? typeExprArray(expr, env) :
    t === 'object' ? (expr.tag ? prettyType(expr) : t) :
    undefined;
}

exports.app2 = app2;
exports.arrow = arrow;
exports.base = base;
exports.prettyType = prettyType;
exports.sameType = sameType;
exports.typeExpr = typeExpr;
