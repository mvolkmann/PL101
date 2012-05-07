'use strict';

function lookup(env, name) {
  var value = env.bindings[name];
  var outer = env.outer;
  return value || outer && lookup(outer, name) || null;
}

exports.lookup = lookup;
