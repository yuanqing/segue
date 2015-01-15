/* globals describe, beforeEach, afterEach, it, expect, jasmine */
'use strict';

var segue = require('..');
var sinon = require('sinon');

describe('segue([cb, opts])(fn1 [, arg1, ...])...()', function() {

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  describe('call each `fn` sequentially', function() {

    var prev, next;

    beforeEach(function() {

      prev = jasmine.createSpy();
      prev.and.callFake(function() {
        setTimeout(function() {
          this(null, 'foo');
        }.bind(this), 10);
      });

      next = jasmine.createSpy();
      next.and.callFake(function() {
        this(null);
      });

    });

    it('with `next` enqueued while `prev` was still running', function() {

      var cb = jasmine.createSpy();
      segue(cb)(prev, 1)(next, 2);

      // `prev`
      expect(prev).not.toHaveBeenCalled();
      clock.tick(0);
      expect(prev).toHaveBeenCalledWith(1);

      // `next`
      expect(next).not.toHaveBeenCalled();
      clock.tick(10); // `prev` finishes at t=10ms
      expect(next).toHaveBeenCalledWith('foo', 2);

      // `cb`
      expect(cb).not.toHaveBeenCalled();

    });

    it('with `next` enqueued after `prev` had already finished running', function() {

      var queue = segue()(prev, 1);
      setTimeout(function() {
        queue(next, 2);
      }, 20);

      // `prev`
      expect(prev).not.toHaveBeenCalled();
      clock.tick(0);
      expect(prev).toHaveBeenCalledWith(1);

      // `next`
      expect(next).not.toHaveBeenCalled();
      clock.tick(20); // `next` was enqueued at t=20ms
      expect(next).toHaveBeenCalledWith('foo', 2);

    });

    it('with `opts.repeat` set to `true`', function() {

      segue({ repeat: true })(prev, 1)(next, 2);

      // `prev`
      expect(prev.calls.count()).toBe(0);
      clock.tick(0);
      expect(prev.calls.count()).toBe(1);
      expect(prev.calls.mostRecent().args).toEqual([1]);

      // `next`
      expect(next.calls.count()).toBe(0);
      clock.tick(10); // first call to `prev` finishes at t=10ms
      expect(next.calls.count()).toBe(1);
      expect(next.calls.mostRecent().args).toEqual(['foo', 2]);

      // `prev`
      expect(prev.calls.count()).toBe(2);
      expect(prev.calls.mostRecent().args).toEqual([1]);

      // `next`
      expect(next.calls.count()).toBe(1);
      clock.tick(10); // second call to `prev` finishes at t=20ms
      expect(next.calls.count()).toBe(2);
      expect(next.calls.mostRecent().args).toEqual(['foo', 2]);

    });

  });

  it('pause and resume the calling of functions in the queue', function() {

    var fn = jasmine.createSpy();
    fn.and.callFake(function() {
      setTimeout(function() {
        this(null);
      }.bind(this), 10);
    });

    var queue = segue({ repeat: true })(fn);

    // pause at t=20ms
    setTimeout(function() {
      queue();
    }, 20);

    // resume at t=40ms
    setTimeout(function() {
      queue();
    }, 40);

    // t=0ms
    expect(fn.calls.count()).toBe(0);
    clock.tick(0);
    expect(fn.calls.count()).toBe(1);

    // t=10ms
    clock.tick(10);
    expect(fn.calls.count()).toBe(2);

    // t=20ms
    clock.tick(10);
    expect(fn.calls.count()).toBe(2);

    // t=30ms
    clock.tick(10);
    expect(fn.calls.count()).toBe(2);

    // t=40ms
    clock.tick(10);
    expect(fn.calls.count()).toBe(3);

  });

  it('on error, pass it to `cb`, and stop calling functions in the queue', function() {

    var cb = jasmine.createSpy();
    var prev = jasmine.createSpy();
    prev.and.callFake(function() {
      setTimeout(function() {
        this('error');
      }.bind(this), 10);
    });
    var next = jasmine.createSpy();

    segue(cb)(prev)(next);

    // `prev`
    expect(prev).not.toHaveBeenCalled();
    clock.tick(0);
    expect(prev).toHaveBeenCalled();

    // `cb`
    expect(cb).not.toHaveBeenCalled();
    clock.tick(10); // `prev` finishes at t=10ms
    expect(cb).toHaveBeenCalledWith('error');

    // `next`
    expect(next).not.toHaveBeenCalled();

  });

});
