'use strict';

var prettyType; // used before defined

function arrow(left, right) {
  return {tag: 'arrowtype', left: left, right: right};
}

function base(name) {
  return {tag: 'basetype', name: name};
}

/*
function nestedPrettyType(type) {
  var pretty = prettyType(type);
  if (type.tag === 'arrowtype') {
    pretty = '(' + pretty + ')';
  }
  return pretty;
}
*/

function prettyType(type) {
  var tag = type.tag;
  switch (tag) {
  case 'arrowtype':
    //var left = nestedPrettyType(type.left);
    //var right = nestedPrettyType(type.right);
    var left = prettyType(type.left);
    var right = prettyType(type.right);
    return '(' + left + ' -> ' + right + ')';
  case 'basetype':
    return type.name;
  default:
    return type;
  }
}

exports.arrow = arrow;
exports.base = base;
exports.prettyType = prettyType;
