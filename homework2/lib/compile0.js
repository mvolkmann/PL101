'use strict';

var endTime = require('./endTime');

function helper(expr, arr) {
  var start = 0;
  if (arr.length) {
    var last = arr[arr.length - 1];
    start = last.start + last.dur;
  }

  if (expr.tag === 'note') {
    expr.start = start;
    arr.push(expr);
  } else {
    helper(expr.left, arr);
    helper(expr.right, arr);
  }
}

function compile(expr) {
  var arr = [];
  helper(expr, arr);
  return arr;
}

module.exports = compile;
