'use strict';

var _ = require('underscore');

var curIndent = 0;
var stack = [];

/**
 * Returns an array containing all the objects in stack
 * that do not have a parent (are "top level").
 * It also removes bookkeeping properties.
 */
function getMus() {
  var result = [];
  stack.forEach(function (obj) {
    delete obj.indent;
    if (obj.topLevel) {
      delete obj.topLevel;
      result.push(obj);
    }
  });
  return result;
}

/**
 * Removes objects from the end of the stack
 * that have indent greater than the specified value.
 */
function pop(indent) {
  var popped;
  do {
    var lastObj = _.last(stack);
    popped = false;
    if (lastObj) {
      popped = lastObj.indent >= indent;
      if (popped) {
        delete lastObj.indent;
        stack.pop();
      }
    }
  } while (popped);
}

function save(obj) {
  obj.indent = curIndent;
  obj.topLevel = true; // assume for now
  pop(curIndent);

  var lastObj = _.last(stack);
  stack.push(obj);
  if (!lastObj) {
    return;
  }

  // If the new object is a child of the last one on the stack ...
  if (obj.indent > lastObj.indent) {
    delete obj.topLevel;

    var lastTag = lastObj.tag;
    if (lastTag === 'repeat') {
      if (lastObj.section) {
        throw new Error('A ' + lastTag + ' can only have one child.');
      } else {
        lastObj.section = obj;
      }
    } else if (lastTag === 'seq' || lastTag === 'par') {
      if (lastObj.left) {
        if (lastObj.right) {
          throw new Error('A ' + lastTag + ' can only have two children.');
        } else {
          lastObj.right = obj;
        }
      } else {
        lastObj.left = obj;
      }
    }
  }
}

function setIndent(indent) {
  curIndent = indent;
}

exports.getMus = getMus;
exports.save = save;
exports.setIndent = setIndent;
