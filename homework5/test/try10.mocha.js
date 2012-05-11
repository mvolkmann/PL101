'use strict';

var assert = require('chai').assert;
// Using try9 code!
var evalScheemString = require('../lib/evalScheem').evalScheemString;
var fs = require('fs');

test('try10', function () {
  var env = {bindings: {}};

  var filename = 'reverse.scheem';
  var code = fs.readFileSync(__dirname + '/' + filename, 'utf8');
  //console.log('code =', code);

  var result = evalScheemString(code, env);
  //console.log('result =', result);
  assert.deepEqual(result, "(c b a)");
});
