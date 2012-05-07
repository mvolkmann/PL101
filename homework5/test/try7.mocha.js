'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try7').evalScheem;
var evalScheemString = require('../lib/try7').evalScheemString;

test('try7', function () {
  var env = {bindings: {}};

  // Defining a function
  var expr =
    ['define', 'add_three',
      ['lambda', 'x', 'y', 'z', ['+', 'x', 'y', 'z']]];
  evalScheem(expr, env);

  // Simple function calls
  var result = evalScheem(['add_three', 1, 2, 3], env);
  assert.equal(result, 6);

  // Calling an anonymous function
  expr = [['lambda', 'x', 'y', ['+', 'x', 'y']], 2, 3];
  result = evalScheem(expr, env);
  assert.equal(result, 5);

  // Passing a function as a value to another function
  expr = ['define', 'plus1', ['lambda', 'x', ['+', 'x', 1]]];
  evalScheem(expr, env);
  expr = ['define', 'applyFn',
    ['lambda', 'fn', 'arg', ['fn', 'arg']]];
  evalScheem(expr, env);
  expr = ['applyFn', 'plus1', 2];
  result = evalScheem(expr, env);
  assert.equal(result, 3);

  // Same as previous using "begin".
  expr = ['begin',
    ['define', 'plus1', ['lambda', 'x', ['+', 'x', 1]]],
    ['define', 'applyFn', ['lambda', 'fn', 'arg', ['fn', 'arg']]],
    ['applyFn', 'plus1', 2]
  ];
  assert.equal(evalScheem(expr, env), 3);

  // Same as previous using a string.
  var code = '(begin ' +
    '(define plus1 (lambda x (+ x 1))) ' +
    '(define applyFn (lambda fn arg (fn arg))) ' +
    '(applyFn plus1 2))';
  assert.equal(evalScheemString(code, env), 3);

  // Inner function uses values from enclosing function
  code = '(begin ' +
    '(define x 4) ' +
    '(define x_plus_1 (lambda (+ x 1))) ' +
    '(x_plus_1))';
  assert.equal(evalScheemString(code, env), 5);

  // Argument to a function shadows a global variable
  code = '(begin ' +
    '(define x 4) ' +
    '(define plus_1 (lambda x (+ x 1))) ' +
    '(plus_1 2))';
  assert.equal(evalScheemString(code, env), 3);

  // A function modifies a global variable
  code = '(begin ' +
    '(define x 1) ' +
    '(define updateX (lambda newX (set! x newX))) ' +
    '(updateX 2) ' +
    'x)';
  assert.equal(evalScheemString(code, env), 2);

  // An inner function modifies a variable in the outer function
  code = '(begin ' +
    '(define outer (lambda x (begin ' +
    '  (define inner (lambda newX (set! x newX))) ' +
    '  (inner 2) ' +
    '  x)))' +
    '(outer 1) ' +
    'x)';
  assert.equal(evalScheemString(code, env), 2);

  // An outer function returns an inner function
  // In the code below, the outer function
  // returns a function that adds a given number
  // to the number passed in.
  code = '(begin ' +
    '  (define outer (lambda x (begin ' +
    '    (define inner (lambda y (+ x y))) ' +
    '    inner)))' +
    '  ((outer 2) 5))';
  assert.equal(evalScheemString(code, env), 7);

  // An outer function returns an inner function,
  // inner function refers to outer function variables
  code = '(begin ' +
    '  (define outer (lambda x (begin ' +
    '    (define outerVar 3) ' +
    '    (define inner (lambda y (+ x y outerVar))) ' +
    '    inner)))' +
    '  ((outer 2) 5))';
  assert.equal(evalScheemString(code, env), 10);

  // A function in a define that calls itself recursively
  code = '(begin ' +
    '  (define factorial (lambda (n) ' +
    '    (if (= n 0) 1 (* n (factorial (- n 1)))))) ' +
    '  (factorial 4))';
  //console.log('\nHERE WE GO!');
  assert.equal(evalScheemString(code, env), 24);
});
