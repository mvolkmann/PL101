'use strict';
/*global
  addBinding: false,
  evalStmts: false,
  parser: false,
  thunkValue: false,
  Turtle: false */

var env = {};
var state;
var turtle;

var stepStart; // used before defined
var trampoline; // used before defined

function cont() {
}

function log(msg) {
  $('#console').append('<p>' + msg + '</p>');
}

function parseCode() {
  var program = $('#input').val();
  $('#console').html('');
  turtle.clear();

  try {
    var stmts = parser.parse(program);
    stepStart(stmts, env);
  } catch (e) {
    log('Parse Error: ' + e);
    throw e;
  }
}

function run() {
  parseCode();
  trampoline(state);
}

function step(state) {
  var data = state.data;
  var tag = data.tag;
  if (tag === 'value') {
    state.data = data.val;
    state.done = true;
  } else if (tag === 'thunk') {
    state.data = data.func.apply(null, data.args);
  } else {
    throw new Error('invalid thunk tag "' + tag + '"');
  }

  if (state.data === null) {
    throw new Error('no data property in state!');
  }
}

/**
 * Returns a state object representing the result of a given expression
 * which is typically the first expression in a sequence.
 */
function stepStart(stmts, env) {
  var thk = evalStmts(stmts, env, thunkValue);
  state = {data: thk, done: false};
}

function takeStep() {
  if (!state) {
    parseCode();
  }

  if (!state.done) {
    step(state);
  }

  if (state.done) {
    $('#step').attr('disabled', true);
  }
}

function trampoline(state) {
  while (!state.done) {
    step(state);
  }
  return state.data;
}

$(document).ready(function () {
  turtle = new Turtle('canvas');

  addBinding(env, 'forward', turtle.forward.bind(turtle));
  addBinding(env, 'home', turtle.home.bind(turtle));
  addBinding(env, 'left', turtle.left.bind(turtle));
  addBinding(env, 'right', turtle.right.bind(turtle));

  $('#run').click(run);
  $('#step').click(takeStep);
  $('#continue').click(cont);
});
