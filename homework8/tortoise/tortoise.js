'use strict';

var evalStmt; // used before defined
var evalStmts; // used before defined
var lookup; // used before defined

var reservedWords = [
  'alert', 'begin', 'car', 'cat', 'cdr', 'cons',
  'define', 'emptyp', 'exit', 'if', 'lambda',
  'length', 'let-one', 'list'
];

function addBinding(env, name, value) {
  if (reservedWords.indexOf(name) !== -1) {
    throw new Error('cannot bind to a reserved word');
  }
  if (!env.hasOwnProperty('bindings')) {
    env.bindings = {};
    env.outer = {};
  }
  //console.log('adding binding for', name);
  env.bindings[name] = value;
}

//function evalStmt(stmt, env) {
function evalStmt(stmt, env, cont) {
  if (!cont) {
    throw new Error('call to evalStmt missing cont argument');
  }

  if (typeof stmt === 'number') {
    //return stmt; // numbers evaluate to themselves
    cont(stmt); // numbers evaluate to themselves
    return;
  }

  //console.log('evalStmt: tag =', stmt.tag);

  switch (stmt.tag) { // statements always have tags
  case 'ignore': // a single expression
    //return evalStmt(stmt.body, env);
    evalStmt(stmt.body, env, function (value) {
      cont(value);
    });
    break;
  case '+':
    //return evalStmt(stmt.left, env) + evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue + rightValue);
      });
    });
    break;
  case '-':
    //return evalStmt(stmt.left, env) - evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue - rightValue);
      });
    });
    break;
  case '*':
    //return evalStmt(stmt.left, env) * evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue * rightValue);
      });
    });
    break;
  case '/':
    //return evalStmt(stmt.left, env) / evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue / rightValue);
      });
    });
    break;
  case '<':
    //return evalStmt(stmt.left, env) < evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue < rightValue);
      });
    });
    break;
  case '<=':
    //return evalStmt(stmt.left, env) <= evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue <= rightValue);
      });
    });
    break;
  case '>':
    //return evalStmt(stmt.left, env) > evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue > rightValue);
      });
    });
    break;
  case '>=':
    //return evalStmt(stmt.left, env) >= evalStmt(stmt.right, env);
    evalStmt(stmt.left, env, function (leftValue) {
      evalStmt(stmt.right, env, function (rightValue) {
        cont(leftValue >= rightValue);
      });
    });
    break;
  case 'call':
    var fn = lookup(env, stmt.name);
    //var args = stmt.args.map(function (argObj) {
    var args = [];
    stmt.args.forEach(function (argObj) {
      //return evalStmt(argObj, env);
      evalStmt(argObj, env, function (value) {
        args.push(value);
      });
    });
    //return fn.apply(null, args);
    cont(fn.apply(null, args));
    break;
  /*
  case 'define': // name args body
    console.log('defining function', stmt.name, 'with args', stmt.args);
    var newFunc = function () { // takes any number of arguments
      var newBindings;
      newBindings = {};
      for (var i = 0; i < stmt.args.length; i++) {
        newBindings[stmt.args[i].name] = arguments[i];
      }
      var newEnv = {bindings: newBindings, outer: env};
      return evalStmts(stmt.body, newEnv);
    };
    addBinding(env, stmt.name, newFunc);
    break;
  */
  case 'ident':
    //return lookup(env, stmt.name);
    cont(lookup(env, stmt.name));
    break;
  case ':=':
    var name = stmt.left;
    //var rhs = evalStmt(stmt.right, env);
    evalStmt(stmt.right, env, function (rhs) {
      addBinding(env, name, rhs);
      cont(rhs);
    });
    //return rhs;
    break;
  /*
  case 'if':
    if (evalStmt(stmt.expr, env)) {
      evalStmts(stmt.body, env);
    }
    break;
  case 'repeat':
    var times = evalStmt(stmt.expr);
    var body = stmt.body;
    var result;
    for (var i = 0; i < times; i++) {
      result = evalStmts(body, env);
    }
    return result;
  */
  case 'var':
    console.log('defined variable', stmt.name);
    addBinding(env, stmt.name, undefined);
    cont();
    break;
  default:
    throw new Error('invalid tag "' + stmt.tag + '" passed to evalStmt');
  }

  return null;
}

//function evalStmts(seq, env) {
function evalStmts(seq, env, cont) {
  var result;
  for (var i = 0; i < seq.length; i++) {
    //result = evalStmt(seq[i], env);
    evalStmt(seq[i], env, cont);
  }
  //return result;
}

function lookup(env, v) {
  if (!(env.hasOwnProperty('bindings'))) {
    throw new Error(v + " not found");
  }

  if (env.bindings.hasOwnProperty(v)) {
    return env.bindings[v];
  }

  return lookup(env.outer, v);
}

if (typeof exports !== 'undefined') {
  exports.addBinding = addBinding;
  exports.evalStmt = evalStmt;
  exports.evalStmts = evalStmts;
}
