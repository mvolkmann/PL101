'use strict';

function compileExpr(expr) {
  if (typeof expr === 'number') {
    return expr.toString();
  }

  var tag = expr.tag;
  switch (tag) {
  case '+':
  case '-':
  case '*':
  case '/':
  case '<':
  case '<=':
  case '>':
  case '>=':
    return '(' + compileExpr(expr.left) + ') ' + tag + ' (' +
      compileExpr(expr.right) + ')';

  default:
    throw new Error('Unknown tag ' + expr.tag);
  }
}

function op(t, l, r) {
  return { tag: t, left: l, right: r };
}

exports.compileExpr = compileExpr;
exports.op = op;
