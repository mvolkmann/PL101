'use strict';

var assert = require('chai').assert;
var add_binding = require('../lib/try6');

test('try6', function () {
  var env1 = {bindings: {'x': 19}, outer: { } };
  var env1u = {bindings: {'x': 19, 'y': 3}, outer: { } };

  var env2 = {
    bindings: {'y': 16},
    outer: {bindings: {'x': 19}, outer: {}}
  };
  var env2u = {
    bindings: {'z': 9, 'y': 16},
    outer: {bindings: {'x': 19}, outer: {}}
  };

  add_binding(env1, 'y', 3);
  assert.deepEqual(env1, env1u, 'Simple new binding');
  add_binding(env2, 'z', 9);
  assert.deepEqual(env2, env2u, 'New binding');
});
