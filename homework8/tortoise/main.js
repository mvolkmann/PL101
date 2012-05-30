'use strict';
/*global addBinding: false, evalStmts: false, parser: false, Turtle: false */

function log(msg) {
  $('#console').append('<p>' + msg + '</p>');
}

$(document).ready(function () {
  var turtle = new Turtle('canvas');

  var env = {};
  addBinding(env, 'forward', turtle.forward.bind(turtle));
  addBinding(env, 'home', turtle.home.bind(turtle));
  addBinding(env, 'left', turtle.left.bind(turtle));
  addBinding(env, 'right', turtle.right.bind(turtle));

  $('#run').click(function () {
    var program = $('#input').val();
    $('#console').html('');
    turtle.clear();
    try {
      var parsed = parser.parse(program);
      try {
        //var result = evalStmts(parsed, env);
        evalStmts(parsed, env, function (result) {
          // do nothing with result
        });
      } catch (e) {
        log('Eval Error: ' + e);
        throw e;
      }
    } catch (e2) {
      log('Parse Error: ' + e2);
      throw e2;
    }
  });
});
