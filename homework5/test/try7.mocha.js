'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/evalScheem').evalScheem;

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
  // Inner function uses values from enclosing function
  // Argument to a function shadows a global variable
  // A function modifies a global variable
  // An inner function modifies a variable in the outer function
  // An outer function returns an inner function
  // An outer function returns an inner function, inner function refers to outer function variables
  // A function in a define that calls itself recursively
});
