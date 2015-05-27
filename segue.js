(function(window) {

  'use strict';

  var PAUSED = 0;
  var RUNNING = 1;
  var ERRORED = 2;

  var noop = function() {};

  var Segue = function(cb, opts) {

    var self = this;

    if (!(self instanceof Segue)) {
      return new Segue(cb, opts);
    }

    if (typeof cb !== 'function') {
      opts = cb;
      cb = noop;
    }

    var repeat = !!(opts && opts.repeat);

    var queue = [];
    var state = PAUSED;
    var i = 0;

    var next = function(err) {
      if (err) {
        state = ERRORED;
        cb(err);
        return self;
      }
      if (state !== RUNNING) {
        return self;
      }
      if (i === queue.length) {
        if (repeat) {
          i = 0;
        } else {
          state = PAUSED;
          return cb();
        }
      }
      var nextFn = queue[i++];
      nextFn[0].apply(self, [].concat(next.bind(self), nextFn[1]));
      return self;
    };

    self.push = function() {
      if (state !== ERRORED) {
        var fn = arguments[0];
        var args = [].slice.call(arguments, 1);
        queue.push([fn, args]);
      }
      return self;
    };

    self.pause = function() {
      state = PAUSED;
      return self;
    };

    self.run = function() {
      if (state === RUNNING) {
        return self;
      }
      state = RUNNING;
      return next();
    };

    self.isRunning = function() {
      return state === RUNNING;
    };

  };

  /* istanbul ignore else */
  if (typeof module === 'object') {
    module.exports = Segue;
  } else {
    window.segue = Segue;
  }

})(this);
