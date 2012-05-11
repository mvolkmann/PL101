'use strict';

var assert = require('chai').assert;
var evalScheemString = require('../lib/evalScheem').evalScheemString;

test('try9', function () {
  var env = {bindings: {}};

  var expr = "(begin " +
    "  (define name 'Mark) " +
    "  (alert 'Hello name))";
  evalScheemString(expr, env);
  // Figure out how to redirect stdout to a buffer
  // so this test can be implemented.
  //assert.equal(result, 3);
});
