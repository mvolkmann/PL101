'use strict';
/*global evalScheem: false, parser: false */

function log(msg) {
  $('#console').append(msg + '<br/>');
}

function run() {
  $('#console').html(''); // clear console

  var user_text = $('#input').val();
  log('Input: "' + user_text + '"');

  try {
    var parsed = parser.parse(user_text);
    log('Parsed: ' + JSON.stringify(parsed));

    var env = {};
    var result = evalScheem(parsed[0], env);
    log('Result: ' + JSON.stringify(result));
  } catch (e) {
    log('Error: ' + e);
  }
}

$(function () {
  $('#runButton').click(run);
});
