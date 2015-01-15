'use strict';

var aps = Array.prototype.slice;

var noop = function() {};

var segue = function(cb, opts) {

  if (typeof cb !== 'function') {
    opts = cb;
    cb = noop;
  }

  var repeat = opts && opts.repeat === true || false;
  var i = -1;
  var queue = [];
  var running = false;
  var nextArgs = [];

  var next = function() {
    var args = aps.call(arguments);
    var err = args.shift();
    if (err || !running || (!repeat && i === queue.length-1)) {
      if (err) {
        cb(err);
      }
      nextArgs = args;
      running = false;
      return;
    }
    i = (i + 1) % queue.length;
    queue[i][0].apply(next, nextArgs.concat(args, queue[i][1]));
    nextArgs = [];
  };

  var enqueue = function() {
    var args = aps.call(arguments);
    var fn;
    if (args.length === 0) { // toggle `running` state
      if (!running && queue.length) {
        running = true;
        next();
      } else {
        running = false;
      }
    } else { // add `fn` and `args` to the function `queue`
      fn = args.shift();
      queue.push([fn, args]);
      if (!running) {
        running = true;
        setTimeout(function() {
          next();
        }, 0); // call the first `fn` only after all other functions have been enqueued
      }
    }
    return enqueue;
  };

  return enqueue;

};

module.exports = segue;
