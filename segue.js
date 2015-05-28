(function(window) {

  'use strict';

  var PAUSED  = 0;
  var PAUSING = 1;
  var RUNNING = 2;
  var ERRORED = 3;

  var noop = function() {};

  var Segue = function(doneCb, opts) {

    var self = this;

    if (!(self instanceof Segue)) {
      return new Segue(doneCb, opts);
    }

    if (typeof doneCb !== 'function') {
      opts = doneCb;
      doneCb = noop;
    }

    var repeat = !!(opts && opts.repeat);

    var queue = [];
    var state = PAUSED;
    var i = 0;

    var pauseCb = noop;

    var next = function(err) {
      if (err) {
        state = ERRORED;
        doneCb(err);
        return self;
      }
      if (state !== RUNNING) {
        state = PAUSED;
        pauseCb();
        pauseCb = noop;
        return self;
      }
      if (i === queue.length) {
        if (repeat) {
          i = 0;
        } else {
          state = PAUSED;
          return doneCb();
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

    self.pause = function(cb) {
      if (state === RUNNING) {
        state = PAUSING;
        pauseCb = cb || noop;
      }
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
      return state === RUNNING || state === PAUSING;
    };

  };

  /* istanbul ignore else */
  if (typeof module === 'object') {
    module.exports = Segue;
  } else {
    window.segue = Segue;
  }

})(this);
