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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9zZWd1ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvc2VndWUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgc2VndWUgPSBmdW5jdGlvbihjYiwgcmVwZWF0KSB7XG5cbiAgLy8gYm90aCBgcmVwZWF0YCBhbmQgYGNiYCBhcmUgb3B0aW9uYWxcbiAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmVwZWF0ID0gY2I7XG4gIH1cbiAgY2IgPSBjYiB8fCBmdW5jdGlvbigpIHt9OyAvLyBkZWZhdWx0IHRvIG5vIG9wXG4gIHJlcGVhdCA9IHJlcGVhdCA9PT0gdHJ1ZSB8fCBmYWxzZTsgLy8gZGVmYXVsdCB0byBgZmFsc2VgXG5cbiAgdmFyIGkgPSAtMTtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciBydW5uaW5nID0gZmFsc2U7XG4gIHZhciBuZXh0QXJncyA9IFtdO1xuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBlcnIgPSBhcmdzLnNoaWZ0KCk7XG4gICAgaWYgKGVyciB8fCAhcnVubmluZyB8fCAoIXJlcGVhdCAmJiBpID09PSBxdWV1ZS5sZW5ndGgtMSkpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2IoZXJyKTtcbiAgICAgIH1cbiAgICAgIG5leHRBcmdzID0gYXJncztcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaSA9IChpICsgMSkgJSBxdWV1ZS5sZW5ndGg7XG4gICAgcXVldWVbaV1bMF0uYXBwbHkobmV4dCwgbmV4dEFyZ3MuY29uY2F0KGFyZ3MsIHF1ZXVlW2ldWzFdKSk7XG4gICAgbmV4dEFyZ3MgPSBbXTtcbiAgfTtcblxuICB2YXIgZW5xdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZm47XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7IC8vIHRvZ2dsZSBgcnVubmluZ2Agc3RhdGVcbiAgICAgIGlmICghcnVubmluZyAmJiBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBhZGQgYGZuYCBhbmQgYGFyZ3NgIHRvIHRoZSBmdW5jdGlvbiBgcXVldWVgXG4gICAgICBmbiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHF1ZXVlLnB1c2goW2ZuLCBhcmdzXSk7XG4gICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9LCAwKTsgLy8gY2FsbCB0aGUgZmlyc3QgYGZuYCBvbmx5IGFmdGVyIGFsbCBvdGhlciBmdW5jdGlvbnMgaGF2ZSBiZWVuIGVucXVldWVkXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnF1ZXVlO1xuICB9O1xuXG4gIHJldHVybiBlbnF1ZXVlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBzZWd1ZTtcbiJdfQ==
(1)
});
