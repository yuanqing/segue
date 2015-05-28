'use strict';

var test = require('tape');
var segue = require('..');
var sinon = require('sinon');

test('initialised without arguments', function(t) {
  t.plan(1);
  var x = function(cb, a) {
    t.equals(a, 1);
    setTimeout(function() {
      cb();
    }, 100);
  };
  segue().push(x, 1)
         .run();
});

test('initialised with `opts` only', function(t) {
  t.plan(1);
  var opts = {
    repeat: false
  };
  var x = function(cb, a) {
    t.equals(a, 1);
    setTimeout(function() {
      cb();
    }, 100);
  };
  segue(opts).push(x, 1)
             .run();
});

test('calls functions in the queue in series', function(t) {
  t.plan(6);
  var arr = [];
  var x = function(cb, a) {
    t.equals(arguments.length, 2);
    arr.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    t.equals(arguments.length, 3);
    arr.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var z = function(cb) {
    t.equals(arguments.length, 1);
    arr.push([]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var doneCb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.looseEquals(arr, [
      [1],
      [2, 3],
      []
    ]);
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y, 2, 3)
                           .push(z)
                           .run();
});

test('calling `run` when already running', function(t) {
  t.plan(3);
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var doneCb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.looseEquals(arr, [
      [1]
    ]);
  };
  var queue = segue(doneCb).push(x, 1)
                           .run()
                           .run();
});

test('repeat if `opts.repeat` is `true`', function(t) {
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    arr.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var flag = true;
  var z = function(cb) {
    arr.push([]);
    if (flag) {
      flag = false;
      setTimeout(function() {
        cb();
      }, 100);
    } else {
      t.looseEquals(arr, [
        [1],
        [2, 3],
        [],
        [1],
        [2, 3],
        []
      ]);
      t.end();
    }
  };
  var doneCb = function() {
    t.fail(); // never called
  };
  var opts = {
    repeat: true
  };
  segue(doneCb, opts).push(x, 1)
                     .push(y, 2, 3)
                     .push(z)
                     .run();
});

test('on error, calls `cb` with the `err`', function(t) {
  t.plan(3);
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb('error');
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var doneCb = function(err) {
    t.equals(err, 'error');
    t.false(queue.isRunning());
    t.looseEquals(arr, [
      [1]
    ]);
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y, 2, 3)
                           .run();
});

test('once an error has occurred, no more functions can be enqueued', function(t) {
  t.plan(4);
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb('error');
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var doneCb = function(err) {
    t.equals(err, 'error');
    t.false(queue.isRunning());
    t.looseEquals(arr, [
      [1]
    ]);
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y, 2, 3)
                           .run();
  setTimeout(function() {
    t.pass();
    queue.push(y, 2, 3);
  }, 200);
});

test('enqueue a function when a function in the queue is still running', function(t) {
  t.plan(4);
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb();
    }, 200);
  };
  var y = function(cb, a, b) {
    arr.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var doneCb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.looseEquals(arr, [
      [1],
      [2, 3]
    ]);
  };
  var queue = segue(doneCb).push(x, 1)
                           .run();
  setTimeout(function() {
    t.pass();
    queue.push(y, 2, 3);
  }, 100);
});

test('enqueue a function when all functions in the queue have finished running', function(t) {
  t.plan(6);
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    arr.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var flag = true;
  var doneCb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    if (flag) {
      flag = false;
      t.looseEquals(arr, [
        [1]
      ]);
    } else {
      t.looseEquals(arr, [
        [1],
        [2, 3]
      ]);
    }
  };
  var queue = segue(doneCb).push(x, 1)
                           .run();
  setTimeout(function() {
    queue.push(y, 2, 3)
         .run();
  }, 200);
});

test('calling `pause`, with `pauseCb`', function(t) {
  t.plan(8);
  var clock = sinon.useFakeTimers();
  var x = function(cb, a) {
    t.equals(a, 1);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var doneCb = function() {
    t.fail(); // never called
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y);
  var pauseFlag = true;
  var pauseCb = function() {
    t.false(queue.isRunning());
    pauseFlag = false;
  };
  queue.run();
  clock.tick(50);
  t.true(pauseFlag);
  t.true(queue.isRunning());
  queue.pause(pauseCb);
  t.true(pauseFlag);
  t.true(queue.isRunning());
  clock.tick(50);
  t.false(pauseFlag);
  t.false(queue.isRunning());
  clock.restore();
});

test('calling `pause`, without `pauseCb`', function(t) {
  t.plan(4);
  var clock = sinon.useFakeTimers();
  var x = function(cb, a) {
    t.equals(a, 1);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var doneCb = function() {
    t.fail(); // never called
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y);
  queue.run();
  clock.tick(50);
  t.true(queue.isRunning());
  queue.pause();
  t.true(queue.isRunning());
  clock.tick(50);
  t.false(queue.isRunning());
  clock.restore();
});

test('calling `pause` when already paused', function(t) {
  t.plan(4);
  var clock = sinon.useFakeTimers();
  var x = function(cb, a) {
    t.equals(a, 1);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var doneCb = function() {
    t.fail(); // never called
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y);
  queue.run();
  clock.tick(50);
  t.true(queue.isRunning());
  queue.pause();
  queue.pause();
  t.true(queue.isRunning());
  clock.tick(50);
  t.false(queue.isRunning());
  clock.restore();
});

test('calling `pause`, then `run`', function(t) {
  t.plan(14);
  var clock = sinon.useFakeTimers();
  var arr = [];
  var x = function(cb, a) {
    arr.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    arr.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var doneFlag = true;
  var doneCb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.true(doneFlag);
    doneFlag = false;
  };
  var queue = segue(doneCb).push(x, 1)
                           .push(y, 2, 3);
  var pauseFlag = true;
  var pauseCb = function() {
    t.false(queue.isRunning());
    pauseFlag = false;
  };
  queue.run();
  clock.tick(50);
  t.true(pauseFlag);
  t.true(queue.isRunning());
  queue.pause(pauseCb);
  t.true(pauseFlag);
  t.true(queue.isRunning());
  clock.tick(50);
  t.false(pauseFlag);
  t.false(queue.isRunning());
  queue.run();
  t.true(doneFlag);
  t.true(queue.isRunning());
  clock.tick(100);
  t.false(doneFlag);
  t.false(queue.isRunning());
  clock.restore();
});
