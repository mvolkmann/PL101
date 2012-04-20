'use strict';

// Note that your implementation does not use the endTime function.
function compile(expr, start) {
  if (!start) {
    start = 0;
  }
  if (expr.tag === 'note') {
    expr.start = start;
    return [expr];
  } else {
    var leftArr = compile(expr.left, start);
    var last = leftArr[leftArr.length - 1];
    start = last.start + last.dur;
    var rightArr = compile(expr.right, start);
    return leftArr.concat(rightArr);
  }
}

module.exports = compile;
