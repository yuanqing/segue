'use strict';

var segue = require('../');

var cb = function(err) {
  if (err) {
    throw err;
  }
};

var queue = segue(cb);

var x = function(done, a) {
  console.log(a); //=> 1
  setTimeout(function() {
    done();
  }, 100);
};

var y = function(done, a, b) {
  console.log(a, b); //=> 2, 3
  done();
};

queue(x, 1)(y, 2, 3);
