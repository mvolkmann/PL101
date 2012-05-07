'use strict';
/*global module: false */

function getBindings(env, name) {
  var bindings = env.bindings;
  var value = bindings[name];
  var outer = env.outer;
  return value !== undefined ? bindings :
    outer ? getBindings(outer, name) : null;
}

function update(env, name, value) {
  var bindings = getBindings(env, name);
  if (!bindings) {
    throw new Error('variable "' + name + '" is not defined');
  }
  bindings[name] = value;
}

module.exports = update;
