!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.segue=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var aps = Array.prototype.slice;

var segue = function(cb, repeat) {

  // both `repeat` and `cb` are optional
  if (typeof cb === 'boolean') {
    repeat = cb;
  }
  cb = cb || function() {}; // default to no op
  repeat = repeat === true || false; // default to `false`

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

module.exports = exports = segue;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L3NlZ3VlL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L3NlZ3VlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxudmFyIHNlZ3VlID0gZnVuY3Rpb24oY2IsIHJlcGVhdCkge1xuXG4gIC8vIGJvdGggYHJlcGVhdGAgYW5kIGBjYmAgYXJlIG9wdGlvbmFsXG4gIGlmICh0eXBlb2YgY2IgPT09ICdib29sZWFuJykge1xuICAgIHJlcGVhdCA9IGNiO1xuICB9XG4gIGNiID0gY2IgfHwgZnVuY3Rpb24oKSB7fTsgLy8gZGVmYXVsdCB0byBubyBvcFxuICByZXBlYXQgPSByZXBlYXQgPT09IHRydWUgfHwgZmFsc2U7IC8vIGRlZmF1bHQgdG8gYGZhbHNlYFxuXG4gIHZhciBpID0gLTE7XG4gIHZhciBxdWV1ZSA9IFtdO1xuICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICB2YXIgbmV4dEFyZ3MgPSBbXTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZXJyID0gYXJncy5zaGlmdCgpO1xuICAgIGlmIChlcnIgfHwgIXJ1bm5pbmcgfHwgKCFyZXBlYXQgJiYgaSA9PT0gcXVldWUubGVuZ3RoLTEpKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNiKGVycik7XG4gICAgICB9XG4gICAgICBuZXh0QXJncyA9IGFyZ3M7XG4gICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGkgPSAoaSArIDEpICUgcXVldWUubGVuZ3RoO1xuICAgIHF1ZXVlW2ldWzBdLmFwcGx5KG5leHQsIG5leHRBcmdzLmNvbmNhdChhcmdzLCBxdWV1ZVtpXVsxXSkpO1xuICAgIG5leHRBcmdzID0gW107XG4gIH07XG5cbiAgdmFyIGVucXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGZuO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgeyAvLyB0b2dnbGUgYHJ1bm5pbmdgIHN0YXRlXG4gICAgICBpZiAoIXJ1bm5pbmcgJiYgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gYWRkIGBmbmAgYW5kIGBhcmdzYCB0byB0aGUgZnVuY3Rpb24gYHF1ZXVlYFxuICAgICAgZm4gPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBxdWV1ZS5wdXNoKFtmbiwgYXJnc10pO1xuICAgICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSwgMCk7IC8vIGNhbGwgdGhlIGZpcnN0IGBmbmAgb25seSBhZnRlciBhbGwgb3RoZXIgZnVuY3Rpb25zIGhhdmUgYmVlbiBlbnF1ZXVlZFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW5xdWV1ZTtcbiAgfTtcblxuICByZXR1cm4gZW5xdWV1ZTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gc2VndWU7XG4iXX0=
(1)
});
