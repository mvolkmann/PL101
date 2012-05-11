'use strict';

var assert = require('chai').assert;
var lookup = require('../lib/evalScheem').lookup;

test('try1', function () {
  var env = {
    bindings: {'x': 2},
    outer: {}
  };
  assert.equal(lookup(env, 'x'), 2);

  env = {bindings: {'x': 2}};
  assert.equal(lookup(env, 'x'), 2);

  env = {
    bindings: {'x': 3},
    outer: {
      bindings: {'x': 2}
    }
  };
  assert.equal(lookup(env, 'x'), 3);

  env = {
    bindings: {'y': 3},
    outer: {
      bindings: {'x': 2}
    }
  };
  assert.equal(lookup(env, 'x'), 2);
});
