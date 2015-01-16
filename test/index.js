'use strict';

var test = require('tape');
var segue = require('../');

test('segue([cb , opts])(fn1 [, arg1, ...])(fn2 [, arg1, ...])', function(t) {

  t.test('calls functions in the queue in series', function(t) {
    var args = [];
    var x = function(done, a) {
      t.equals(arguments.length, 2);
      args.push([a]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var y = function(done, a, b) {
      t.equals(arguments.length, 3);
      args.push([a, b]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var z = function(done) {
      t.equals(arguments.length, 1);
      args.push([]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var cb = function(err) {
      t.false(err);
      t.looseEquals(args, [
        [1],
        [2, 3],
        []
      ]);
      t.end();
    };
    segue(cb)(x, 1)(y, 2, 3)(z);
  });

  t.test('initialised without arguments', function(t) {
    t.plan(2);
    var x = function(done, a) {
      t.equals(arguments.length, 2);
      t.equals(a, 1);
      setTimeout(function() {
        done();
      }, 100);
    };
    segue()(x, 1);
  });

  t.test('initialised with `opts` only', function(t) {
    t.plan(2);
    var x = function(done, a) {
      t.equals(arguments.length, 2);
      t.equals(a, 1);
      setTimeout(function() {
        done();
      }, 100);
    };
    segue({ repeat: false })(x, 1);
  });

  t.test('repeat if `opts.repeat` is `true`', function(t) {
    var args = [];
    var x = function(done, a) {
      args.push([a]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var y = function(done, a, b) {
      args.push([a, b]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var flag = true;
    var z = function(done) {
      args.push([]);
      if (flag) {
        flag = false;
        setTimeout(function() {
          done();
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
    segue(cb, { repeat: true })(x, 1)(y, 2, 3)(z);
  });

  t.test('on error, calls `cb` with the `err`', function(t) {
    var args = [];
    var x = function(done, a) {
      args.push([a]);
      setTimeout(function() {
        done('error');
      }, 100);
    };
    var y = function() {
      t.fail(); // never called
    };
    var cb = function(err) {
      t.equals(err, 'error');
      t.looseEquals(args, [
        [1]
      ]);
      t.end();
    };
    segue(cb)(x, 1)(y, 2, 3);
  });

  t.test('once an error has occurred, no more functions can be enqueued', function(t) {
    var args = [];
    var x = function(done, a) {
      args.push([a]);
      setTimeout(function() {
        done('error');
      }, 100);
    };
    var y = function() {
      t.fail(); // never called
    };
    var flag = true;
    var cb = function(err) {
      t.equals(err, 'error');
      t.looseEquals(args, [
        [1]
      ]);
      if (flag) {
        flag = false;
      } else {
        t.end();
      }
    };
    var s = segue(cb)(x, 1)(y, 2, 3);
    setTimeout(function() {
      s(y, 2, 3);
    }, 200);
  });

  t.test('enqueuing a function when a function in the queue is still running', function(t) {
    var args = [];
    var x = function(done, a) {
      args.push([a]);
      setTimeout(function() {
        done();
      }, 200);
    };
    var y = function(done, a, b) {
      args.push([a, b]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var cb = function(err) {
      t.false(err);
      t.looseEquals(args, [
        [1],
        [2, 3]
      ]);
      t.end();
    };
    var s = segue(cb)(x, 1);
    setTimeout(function() {
      s(y, 2, 3);
    }, 100);
  });

  t.test('enqueuing a function when all functions in the queue have finished running', function(t) {
    var args = [];
    var x = function(done, a) {
      args.push([a]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var y = function(done, a, b) {
      args.push([a, b]);
      setTimeout(function() {
        done();
      }, 100);
    };
    var flag = true;
    var cb = function(err) {
      t.false(err);
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
        t.end();
      }
    };
    var s = segue(cb)(x, 1);
    setTimeout(function() {
      s(y, 2, 3);
    }, 200);
  });

});
