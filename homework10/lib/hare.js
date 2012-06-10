'use strict';

var compileExpr; // used before defined
var compileStatements; // used before defined

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

function compileStatement(stmt) {
  switch (stmt.tag) {
  case ':=':
    return '_res = (' + stmt.left + ' = ' + compileExpr(stmt.right) + ');\n';
  case 'define':
    return '_res = 0;\n' +
      'var ' + stmt.name + ' = function () {\n' +
      compileStatements(stmt.body) +
      '};\n';
  //case 'if':
  //  return '';
  case 'ignore': // a single expression
    return '_res = (' + compileExpr(stmt.body) + ');\n';
  //case 'repeat':
  //  return '';
  case 'var': // evaluates to 0
    return '_res = 0;\nvar ' + stmt.name + ';\n';
  default:
    throw new Error('Unknown tag ' + stmt.tag);
  }
}

function compileStatements(stmts, isFnBody) {
  var code = 'var _res;\n';

  stmts.forEach(function (stmt) {
    code += compileStatement(stmt);
  });

  if (isFnBody) {
    code += 'return _res;\n';
  }

  //console.log('compileStatements: code =', code);
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

function ign(e) {
  return { tag: 'ignore', body: e };
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
exports.compileStatements = compileStatements;
exports.ign = ign;
exports.op = op;
exports.ref = ref;
