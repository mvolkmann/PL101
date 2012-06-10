'use strict';
var assert = require('chai').assert;
var tscheem = require('../lib/tscheem');
var app2 = tscheem.app2;
var arrow = tscheem.arrow;
var base = tscheem.base;
var prettyType = tscheem.prettyType;
var sameType = tscheem.sameType;
var typeExpr = tscheem.typeExpr;

test('curry', function () {
  function plusCurry(x) {
    return function (y) {
        return x + y;
      };
  }

  assert.typeOf(app2(plusCurry), 'function');
  assert.typeOf(app2(plusCurry)(2), 'function');
  assert.equal(app2(plusCurry)(2)(3), 5);
});

test('prettyType', function () {
  assert.equal(prettyType(base('foo')), 'foo');
  assert.equal(prettyType(arrow('foo', 'bar')), '(foo -> bar)');
  assert.equal(prettyType(arrow('foo', arrow('bar', 'baz'))), '(foo -> (bar -> baz))');
});

test('typeExpr', function () {
  var b1 = base('num');
  var b2 = base('atom');
  var a1 = arrow(b1, b1);
  var a2 = arrow(b1, b2);
  var a3 = arrow(b2, b1);
  var env = {};

  assert.isTrue(sameType(b1, b1, env));
  assert.isFalse(sameType(b1, b2, env));
  assert.isFalse(sameType(b1, a1, env));
  assert.isFalse(sameType(a1, b1, env));
  assert.isTrue(sameType(a1, a1, env));
  assert.isFalse(sameType(a1, a2, env));
  assert.isFalse(sameType(a1, a3, env));
});

test('typeFunction', function () {
  var context1 = {
    bindings: {
      'f': arrow(base('num'), arrow(base('num'), base('num'))),
      'x': base('num')
    }
  };
  var context2 = {
    bindings: {
      'f': arrow(arrow(base('num'), base('num')), base('num')),
      'x': arrow(base('num'), base('num'))
    }
  };

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
      return false;
    }

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every(function (key) {
      return deepEqual(a[key], b[key]);
    });
  }

  function typeExprTester(env) {
    var fType = typeExpr('f', env);
    if (fType.tag !== 'arrowtype') {
      return fType;
    }

    var paramType = fType.left;
    var argType = typeExpr('x', env);
    var returnType = fType.right;
    //console.log('paramType =', paramType);
    //console.log('argType =', argType);
    //console.log('returnType =', returnType);

    if (deepEqual(argType, paramType)) {
      return returnType;
    }

    throw new Error('argument and parameter types do not match');
  }

  var expected = arrow(base('num'), base('num'));
  assert.deepEqual(typeExprTester(context1), expected);

  expected = base('num');
  assert.deepEqual(typeExprTester(context2), expected);
});

test('typeIf', function () {
  var context = {
    bindings: {
      '+': arrow(base('num'), arrow(base('num'), base('num'))),
      '<': arrow(base('num'), arrow(base('num'), base('bool')))
    }
  };

  function wrapExceptions(fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      try {
        return fn.apply(null, args);
      } catch (e) {
        console.log('wrapExceptions:', e);
        return undefined;
      }
    };
  }

  typeExpr = wrapExceptions(typeExpr);

  assert.deepEqual(typeExpr(['if', true, 3, 5], {}), base('num'));
  assert.deepEqual(typeExpr(['if', true, true, 5], {}), undefined);
  assert.deepEqual(typeExpr(['if', 3, 3, 5], {}), undefined);
  assert.deepEqual(typeExpr([['+', 2], 3], context), base('num'));
  assert.deepEqual(typeExpr([['<', 1], 2], context), base('bool'));
  assert.deepEqual(
    typeExpr(['if', [['<', 1], 2], [['+', 2], 3], 5], context),
    base('num'));
});
