'use strict';

var assert = require('chai').assert;
var update = require('../lib/try3'); // can't use evalScheem.js

test('try3', function () {
  var env = {bindings: {'x': 1}};
  update(env, 'x', 2);
  assert.equal(env.bindings.x, 2);

  env = {bindings: {'x': 1}, outer: {bindings: {'x': 2}}};
  update(env, 'x', 3);
  assert.equal(env.bindings.x, 3);
  assert.equal(env.outer.bindings.x, 2);
});
