'use strict';
/*global
  addBinding: false,
  evalStmts: false,
  trampoline: false,
  parser: false,
  step: false,
  stepStart: false,
  Turtle: false */

var env = {};
var state;
var turtle;

function cont() {
}

function log(msg) {
  $('#console').append('<p>' + msg + '</p>');
}

function parseCode(cb) {
  var program = $('#input').val();
  $('#console').html('');

  turtle.clear();

  try {
    var parsed = parser.parse(program);
    try {
      console.log('main.js: parsed =', parsed);
      var thk = evalStmts(parsed, env,
        function (result) {
          alert('Success!');
        },
        function (msg) {
          alert('Error: ' + msg);
        });
      console.log('main.js: thk =', thk);
      cb(thk);
    } catch (e) {
      log('Eval Error: ' + e);
      throw e;
    }
  } catch (e2) {
    log('Parse Error: ' + e2);
    throw e2;
  }
}

function run() {
  parseCode(trampoline);
}

function takeStep() {
  if (state) {
    if (!state.done) {
      step(state);
    }
  } else {
    parseCode(function (thk) {
      state = stepStart(thk, env);
      if (state.done) {
        $('#step').attr('disabled', true);
      }
    });
  }
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
