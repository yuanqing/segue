'use strict';

var test = require('tape');
var segue = require('..');

test('calls functions in the queue in series', function(t) {
  t.plan(6);
  var args = [];
  var x = function(cb, a) {
    t.equals(arguments.length, 2);
    args.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    t.equals(arguments.length, 3);
    args.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var z = function(cb) {
    t.equals(arguments.length, 1);
    args.push([]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var cb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.looseEquals(args, [
      [1],
      [2, 3],
      []
    ]);
  };
  var queue = segue(cb).push(x, 1)
                       .push(y, 2, 3)
                       .push(z)
                       .run();
});

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

test('repeat if `opts.repeat` is `true`', function(t) {
  var args = [];
  var x = function(cb, a) {
    args.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    args.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var flag = true;
  var z = function(cb) {
    args.push([]);
    if (flag) {
      flag = false;
      setTimeout(function() {
        cb();
      }, 100);
    } else {
      t.looseEquals(args, [
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
  var cb = function() {
    t.fail(); // never called
  };
  var opts = {
    repeat: true
  };
  segue(cb, opts).push(x, 1)
                 .push(y, 2, 3)
                 .push(z)
                 .run();
});

test('on error, calls `cb` with the `err`', function(t) {
  t.plan(3);
  var args = [];
  var x = function(cb, a) {
    args.push([a]);
    setTimeout(function() {
      cb('error');
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var cb = function(err) {
    t.equals(err, 'error');
    t.false(queue.isRunning());
    t.looseEquals(args, [
      [1]
    ]);
  };
  var queue = segue(cb).push(x, 1)
                       .push(y, 2, 3)
                       .run();
});

test('once an error has occurred, no more functions can be enqueued', function(t) {
  t.plan(4);
  var args = [];
  var x = function(cb, a) {
    args.push([a]);
    setTimeout(function() {
      cb('error');
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var cb = function(err) {
    t.equals(err, 'error');
    t.false(queue.isRunning());
    t.looseEquals(args, [
      [1]
    ]);
  };
  var queue = segue(cb).push(x, 1)
                       .push(y, 2, 3)
                       .run();
  setTimeout(function() {
    t.pass();
    queue.push(y, 2, 3);
  }, 200);
});

test('enqueue a function when a function in the queue is still running', function(t) {
  t.plan(4);
  var args = [];
  var x = function(cb, a) {
    args.push([a]);
    setTimeout(function() {
      cb();
    }, 200);
  };
  var y = function(cb, a, b) {
    args.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var cb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.looseEquals(args, [
      [1],
      [2, 3]
    ]);
  };
  var queue = segue(cb).push(x, 1)
                       .run();
  setTimeout(function() {
    t.pass();
    queue.push(y, 2, 3);
  }, 100);
});

test('enqueue a function when all functions in the queue have finished running', function(t) {
  t.plan(6);
  var args = [];
  var x = function(cb, a) {
    args.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    args.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var flag = true;
  var cb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    if (flag) {
      flag = false;
      t.looseEquals(args, [
        [1]
      ]);
    } else {
      t.looseEquals(args, [
        [1],
        [2, 3]
      ]);
    }
  };
  var queue = segue(cb).push(x, 1)
                       .run();
  setTimeout(function() {
    queue.push(y, 2, 3)
         .run();
  }, 200);
});

test('pause', function(t) {
  t.plan(2);
  var x = function(cb, a) {
    t.equals(a, 1);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function() {
    t.fail(); // never called
  };
  var cb = function() {
    t.fail(); // never called
  };
  var queue = segue(cb).push(x, 1)
                       .push(y)
                       .run();
  setTimeout(function() {
    t.pass();
    queue.pause();
  }, 50);
});

test('pause, then run', function(t) {
  t.plan(6);
  var args = [];
  var x = function(cb, a) {
    args.push([a]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var y = function(cb, a, b) {
    args.push([a, b]);
    setTimeout(function() {
      cb();
    }, 100);
  };
  var cb = function(err) {
    t.false(err);
    t.false(queue.isRunning());
    t.looseEquals(args, [
      [1],
      [2, 3]
    ]);
  };
  var queue = segue(cb).push(x, 1)
                       .push(y, 2, 3)
                       .run();
  setTimeout(function() {
    t.pass();
    queue.pause();
  }, 50);
  setTimeout(function() {
    t.false(queue.isRunning());
    queue.run();
    t.true(queue.isRunning());
    queue.run();
  }, 100);
});
