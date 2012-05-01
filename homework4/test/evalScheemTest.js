'use strict';
/*global chai: false, module: false */

var assert;
var parse;

// If running in Node.js ...
if (typeof module !== 'undefined') {
  assert = require('chai').assert;
  var interpreter = require('../lib/scheemInterpreter');
  var evalScheem = interpreter.evalScheem;
  var evalScheemString = interpreter.evalScheemString;

  // TODO: Why do this here?
  //var fs = require('fs');
  //var peg = require('pegjs');
  //var parse = peg.buildParser(fs.readFileSync('scheemParser.peg', 'utf-8')).parse;

} else { // assume running in a browser
  assert = chai.assert;
  parse = parser.parse;
}

suite('scheem', function () {

  test('arithmetic', function () {
    assert.equal(evalScheem(['+', 2, 3]), 5);
    assert.equal(evalScheem(['*', 2, 3]), 6);
    assert.equal(evalScheem(['/', 1, 2]), 0.5);
    assert.equal(evalScheem(['*', ['/', 8, 4], ['+', 1, 1]]), 4);

    assert.equal(evalScheemString('(+ 2 3)'), 5);
    assert.equal(evalScheemString('(/ 8 4)'), 2);
    assert.equal(evalScheemString('(+ 1 1)'), 2);
    assert.equal(evalScheemString('(* 2 2)'), 4);
    assert.equal(evalScheemString('(+ (+ 1 2) (+ 3 4) )'), 10);
  });

  test('retrieving', function () {
    assert.equal(evalScheem(5), 5);
    assert.equal(evalScheem('x', {'x': 5}), 5);
    assert.equal(evalScheem(['+', 2, 3]), 5);
    assert.equal(evalScheem(['*', 'y', 3], {y: 2}), 6);

    var env = {x: 1, y: 2, z: 3};
    assert.equal(evalScheem(['/', 'z', ['+', 'x', 'y']], env), 1);
    assert.equal(evalScheemString('(/ z (+ x y))', env), 1);
  });

  test('setting', function () {
    var env = {'x': 5, 'y': 1};

    assert.equal(evalScheem('x', env), 5);

    assert.equal(evalScheem(['define', 'a', 5], env), 0);
    assert.equal(env.a, 5);

    assert.equal(evalScheem(['set!', 'a', 1], env), 0);
    assert.equal(env.a, 1);

    assert.equal(evalScheem(['set!', 'x', 7], env), 0);
    assert.equal(env.x, 7);

    assert.equal(evalScheem(['set!', 'y', ['+', 'x', 1]], env), 0);
    assert.equal(env.x, 7);
    assert.equal(env.y, 8);

    assert.equal(evalScheemString('(set! x (+ y 2))', env), 0);
    assert.equal(env.x, 10);
  });

  test('begin', function () {
    var env = {y: 2};
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
      prg = ['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']]];
      assert.equal(evalScheem(prg, env), 0);
      assert.equal(env.x, 6);

      prg = '(begin (set! x 5) (set! x (+ y x)))';
      assert.equal(evalScheemString(prg, env), 0);
      assert.equal(env.x, 6);
  });

  test('quote', function () {
    var env = {};
    assert.equal(evalScheem(['+', 2, 3], env), 5);
    assert.deepEqual(evalScheem(['quote', ['+', 2, 3]], env), ['+', 2, 3]);
    assert.deepEqual(evalScheem(['quote', ['quote', ['+', 2, 3]]], env),
    ['quote', ['+', 2, 3]]);

    assert.deepEqual(evalScheemString("'(+ 2 3)"), "(+ 2 3)");
  });

  test('comparison', function () {
    var env = {};
    assert.equal(evalScheem(['=', 2, ['+', 1, 1]], env), '#t');
    assert.equal(evalScheem(['+', 2, 3], env), 5);
    assert.equal(evalScheem(['<', 2, 2], env), '#f');
    assert.equal(evalScheem(['<', 2, 3], env), '#t');
    assert.equal(evalScheem(['<', ['+', 1, 1], ['+', 2, 3]], env), '#t');

    assert.equal(evalScheemString('(< (+ 1 1) (+ 2 3))'), '#t');
  });

  test('list operations', function () {
    assert.deepEqual(evalScheem(['quote', [2, 3]]), [2, 3]);
    assert.deepEqual(evalScheem(['cons', 1, ['quote', [2, 3]]]), [1, 2, 3]);
    assert.deepEqual(evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]]),
    [[1, 2], 3, 4]);
    assert.deepEqual(evalScheem(['car', ['quote', [[1, 2], 3, 4]]]), [1, 2]);
    assert.deepEqual(evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]]), [3, 4]);

    assert.deepEqual(evalScheemString("(cdr '((1 2) 3 4))"), '(3 4)');
  });

  test('conditionals', function () {
    var env = {'error': -1};
    var error = 'error';
    assert.equal(evalScheem(['if', ['=', 1, 1], 2, 3]), 2);
    assert.equal(evalScheem(['if', ['=', 1, 0], 2, 3]), 3);
    assert.equal(evalScheem(['if', ['=', 1, 1], 2, error], env), 2);
    assert.equal(evalScheem(['if', ['=', 1, 1], error, 3], env), env.error);
    assert.equal(evalScheem(['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12]), 11);

    assert.equal(evalScheemString('(if (= 1 1) (if (= 2 3) 10 11) 12)'), 11);
  });

}); // end of suite
