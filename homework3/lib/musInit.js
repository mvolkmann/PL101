'use strict';

var _ = require('underscore');

var curIndent = 0;
var stack = [];

/**
 * Returns an array containing all the objects in stack
 * that do not have a parent.
 * It also removes bookkeeping properties.
 */
function getMus() {
  var result = [];
  stack.forEach(function (obj) {
    //console.log('getMus: obj =', obj);
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
        //console.log('popped', lastObj);
      }
    }
  } while (popped);
}

function save(obj) {
  //console.log('save: obj =', obj);
  obj.indent = curIndent;
  obj.topLevel = true; // assume for now
  pop(curIndent);

  var lastObj = _.last(stack);
  if (!lastObj) {
    stack.push(obj);
    return;
  }

  if (obj.indent > lastObj.indent) {
    var lastTag = lastObj.tag;
    if (lastTag === 'repeat') {
      if (lastObj.section) {
        throw new Error('A ' + lastTag + ' can only have one child.');
      } else {
        lastObj.section = obj;
        delete obj.topLevel;
      }
    } else if (lastTag === 'seq' || lastTag === 'par') {
      if (lastObj.left) {
        if (lastObj.right) {
          throw new Error('A ' + lastTag + ' can only have two children.');
        } else {
          lastObj.right = obj;
          delete obj.topLevel;
        }
      } else {
        lastObj.left = obj;
        delete obj.topLevel;
      }
    }
    //console.log('modified', lastObj);
  }

  stack.push(obj);
  //console.log('pushed', obj);
  //console.log('stack is now', stack);
}

function setIndent(indent) {
  curIndent = indent;
}

exports.getMus = getMus;
exports.save = save;
exports.setIndent = setIndent;
