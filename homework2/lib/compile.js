'use strict';
var _ = require('underscore');

/*
var noteToPitch = {
  a0: 21,
  b0: 23,
  c1: 24,
  d1: 26,
  e1: 28,
  f1: 29,
  g1: 31,
  a1: 33,
  b1: 35,
  c2: 36,
  d2: 38,
  e2: 40,
  f2: 41,
  g2: 43,
  a2: 45,
  b2: 47,
  c3: 48,
  d3: 50,
  e3: 52,
  f3: 53,
  g3: 55,
  a3: 57,
  b3: 59,
  c4: 60,
  d4: 62,
  e4: 64,
  f4: 65,
  g4: 67,
  a4: 69,
  b4: 71,
  c5: 72,
  d5: 74,
  e5: 76,
  f5: 77,
  g5: 79,
  a5: 81,
  b5: 83,
  c6: 84,
  d6: 86,
  e6: 88,
  f6: 89,
  g6: 91,
  a6: 93,
  b6: 95,
  c7: 96,
  d7: 98,
  e7: 100,
  f7: 101,
  g7: 103,
  a7: 105,
  b7: 107,
  c8: 108
};
*/
function noteToPitch(note) {
  var letterPitch = note.charCodeAt(0) - 99;
  if (letterPitch < 0) {
    letterPitch += 13;
  }
  console.log('letterPitch of', note, 'is', letterPitch);
  var octave = parseInt(note[1], 10);
  console.log('octave of', note, 'is', octave);
  var pitch = 12 + 12 * octave + letterPitch;
  console.log('pitch of', note, 'is', pitch);
  return pitch;
}

function compile(expr, start) {
  var last;
  var leftArr;
  var rightArr;
  var tag = expr.tag;

  if (!start) {
    start = 0;
  }

  if (tag === 'note' || tag === 'rest') {
    //expr.pitch = noteToPitch[expr.pitch];
    //expr.pitch = noteToPitch(expr.pitch);
    var copy = _.clone(expr);
    copy.start = start;
    return [copy];
  } else if (tag === 'seq') {
    leftArr = compile(expr.left, start);
    last = _.last(leftArr);
    start = last.start + last.dur;
    rightArr = compile(expr.right, start);
    return leftArr.concat(rightArr);
  } else if (tag === 'par') {
    leftArr = compile(expr.left, start);
    rightArr = compile(expr.right, start);
    return leftArr.concat(rightArr);
  } else if (tag === 'repeat') {
    var result = [];
    _.times(expr.count, function () {
      var notes = compile(expr.section, start);
      last = _.last(notes);
      start = last.start + last.dur;
      result = result.concat(notes);
    });
    return result;
  } else {
    throw new Error('invalid tag ' + tag);
  }
}

module.exports = compile;
