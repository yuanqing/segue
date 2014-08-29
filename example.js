'use strict';

var segue = require('./index.js');

var cb = function(err) {
  if (err) {throw err; }
};

var queue = segue(cb);

var foo = function(a) {
  var that = this;
  console.log(a); //=> 'Hello'
  setTimeout(function() {
    that(null, a);
  }, 100);
};

var bar = function(a, b) {
  console.log(a + ', ' + b); //=> 'Hello, World!'
  this(null, a, b);
};

queue(foo, 'Hello')(bar, 'World!');
