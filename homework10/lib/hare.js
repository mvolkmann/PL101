'use strict';

var compileExpr; // used before defined

function compileCall(expr) {
  //console.log('compileCall: expr =', expr);
  var code = expr.name + '(';

  var firstArg = true;
  expr.args.forEach(function (arg) {
    if (firstArg) {
      firstArg = false;
    } else {
      code += ', ';
    }
    var tag = arg.tag;
    var value = tag === 'ident' ? arg.name : arg;
    code += compileExpr(value);
  });

  code += ')';
  //console.log('compileCall: code =', code);
  return code;
}

function compileEnvironment(env) {
  var code = '';
  env.forEach(function (arr) {
    var name = arr[0];
    var value = arr[1];
    code += 'var ' + name + ' = ' + value + ';\n';
  });
  return code;
}

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

  case 'call':
    return compileCall(expr);

  case 'ident':
    return expr.name;

  default:
    throw new Error('Unknown tag ' + expr.tag);
  }
}

function app(f, args) {
  return {tag: 'call', name: f, args: args};
}

function op(t, l, r) {
  return {tag: t, left: l, right: r};
}

function ref(n) {
  return {tag: 'ident', name: n};
}

exports.app = app;
exports.compileEnvironment = compileEnvironment;
exports.compileExpr = compileExpr;
exports.op = op;
exports.ref = ref;
