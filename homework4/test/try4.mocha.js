'use strict';

var assert = require('chai').assert;
var evalScheem = require('../lib/try4');

test('try4', function () {
  var env = {};
  var prg = ['begin',
    ['define', 'x', 5],
    ['set!', 'x', ['+', 'x', 1]],
    ['+', 2, 'x']];
  assert.equal(evalScheem(prg, env), 8);

  prg = ['begin', 1, 2, 3];
  assert.equal(evalScheem(prg, env), 3);

  prg = ['begin', ['+', 2, 2]];
  assert.equal(evalScheem(prg, env), 4);

  prg = ['begin', 'x', 'y', 'x'];
  assert.equal(evalScheem(prg, env), 6);

  env.y = 1;
  prg = ['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x'], 'x']];
  assert.equal(evalScheem(prg, env), 0);
  assert.equal(env.x, 6);
});
