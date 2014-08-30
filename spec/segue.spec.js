/* globals describe, beforeEach, it, expect, jasmine */
'use strict';

var segue = require('..');

describe('segue(cb)(fn [, arg1, ...])...', function() {

  describe('calls each `fn` sequentially', function() {

    describe('with `next` using arguments from the `this` callback of `prev`', function() {

      var cb, prev, next;

      beforeEach(function() {

        cb = jasmine.createSpy();
        prev = function(foo) {
          var that = this;
          expect(foo).toBe(1);
          setTimeout(function() {
            that(null, 'from prev');
          }, 10);
        };
        next = function(foo) {
          expect(foo).toBe('from prev');
          expect(cb).not.toHaveBeenCalled();
          this(null);
        };

      });

      it('when `next` had been enqueued while `prev` was still running', function() {

        segue(cb)(prev, 1)(next);

      });

      it('when `next` had been enqueued after `prev` had already returned', function() {

        var queue = segue(cb)(prev, 1);
        setTimeout(function() {
          queue(next);
        }, 100); // `prev` returned after 10ms

      });

    });

    it('with `next` not using arguments from the `this` callback of `prev`', function(done) {

      var cb = jasmine.createSpy();
      var prev = function(foo) {
        var that = this;
        expect(arguments.length).toBe(1);
        expect(foo).toBe(1);
        setTimeout(function() {
          that(null, 'from prev');
        }, 10);
      };
      var next = function(foo, bar) {
        var that = this;
        expect(arguments.length).toBe(2);
        expect(foo).toBe('from prev');
        expect(bar).toBe(2);
        setTimeout(function() {
          that(null);
          expect(cb).not.toHaveBeenCalled();
          done();
        }, 10);
      };

      segue(cb)(prev, 1)(next, 2);

    });

  });

  describe('passes error to `cb` when there was an error', function() {

    it('in an asynchronous function', function(done) {

      var cb = jasmine.createSpy();
      var next = jasmine.createSpy();
      var prev = function() {
        var that = this;
        setTimeout(function() {
          that('error');
          expect(cb).toHaveBeenCalledWith('error');
          expect(next).not.toHaveBeenCalled();
          done();
        }, 10);
      };

      segue(cb)(prev)(next);

    });

    it('in a synchronous function', function() {

      var cb = jasmine.createSpy();
      var next = jasmine.createSpy();
      var prev = function() {
        this('error');
        expect(cb).toHaveBeenCalledWith('error');
        expect(next).not.toHaveBeenCalled();
      };

      segue(cb)(prev)(next);

    });

  });

});
