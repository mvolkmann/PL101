'use strict';

var assert = require('chai').assert;
var parser = require('../lib/mus');
var util = require('util');

test('mus', function () {
  var input =
    "seq\n" +
    "  repeat 3\n" +
    "    note b4 250\n" +
    "  par\n" +
    "    note c4 500\n" +
    "    note d4 500\n";

  var output = [{
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
      
  var result = parser.parse(input);
  //console.log('result =', util.inspect(result, false, null));
  assert.deepEqual(result, output);
});
