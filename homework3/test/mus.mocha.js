'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var parser = require('../lib/mus');
var util = require('util');

test('mus', function (done) {
  var err = null;
  var input = fs.readFileSync(__dirname + '/t1.in', 'utf8');
  var expected = fs.readFileSync(__dirname + '/t1.mus', 'utf8');
  try {
    expected = JSON.parse(expected);
    var actual = parser.parse(input);
    //console.log('result =', util.inspect(actual, false, null));
    assert.deepEqual(actual, expected);
  } catch (e) {
    err = e;
  }
  done(err);
});
