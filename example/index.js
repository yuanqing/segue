'use strict';

var segue = require('..');

var done = function(err) {
  if (err) {
    throw err;
  }
};

var queue = segue(done);

var x = function(cb, a) {
  console.log(a); //=> 1
  setTimeout(function() {
    cb();
  }, 100);
};

var y = function(cb, a, b) {
  console.log(a, b); //=> 2, 3
  cb();
};

queue.push(x, 1)
     .push(y, 2, 3);

queue.run();
