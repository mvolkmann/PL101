'use strict';

function endTime(time, expr) {
  return expr.tag === 'note' ?
    time + expr.dur :
    endTime(endTime(time, expr.left), expr.right);
}

module.exports = endTime;
