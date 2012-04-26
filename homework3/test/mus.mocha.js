'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var parser = require('../lib/mus');
var util = require('util');

test('mus', function () {
  var input = fs.readFileSync(__dirname + '/../lib/in.mus', 'utf8');
  var expected = [{
    tag: 'seq',
    left: {
      tag: 'repeat',
      section: {tag: 'note', pitch: 'b4', dur: 250},
      count: 3
    },
    right: {
      tag: 'par',
      left: {tag: 'note', pitch: 'c4', dur: 500},
      right: {tag: 'note', pitch: 'd4', dur: 500}
    }
  }];
      
  var actual = parser.parse(input);
  //console.log('result =', util.inspect(actual, false, null));
  assert.deepEqual(actual, expected);
});
