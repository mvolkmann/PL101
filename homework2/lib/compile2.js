'use strict';

function compile(expr, start) {
  var leftArr;
  var rightArr;
  var tag = expr.tag;

  if (!start) {
    start = 0;
  }

  if (tag === 'note') {
    expr.start = start;
    return [expr];
  } else if (tag === 'seq') {
    leftArr = compile(expr.left, start);
    var last = leftArr[leftArr.length - 1];
    start = last.start + last.dur;
    rightArr = compile(expr.right, start);
    return leftArr.concat(rightArr);
  } else if (tag === 'par') {
    leftArr = compile(expr.left, start);
    rightArr = compile(expr.right, start);
    return leftArr.concat(rightArr);
  } else {
    throw new Error('invalid tag ' + tag);
  }
}

module.exports = compile;
