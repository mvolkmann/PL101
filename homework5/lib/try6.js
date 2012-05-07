'use strict';

function addBinding(env, name, value) {
  env.bindings[name] = value;
}

module.exports = addBinding;
