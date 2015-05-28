# Segue.js [![npm Version](http://img.shields.io/npm/v/segue.svg?style=flat)](https://www.npmjs.org/package/segue) [![Build Status](https://img.shields.io/travis/yuanqing/segue.svg?style=flat)](https://travis-ci.org/yuanqing/segue) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/segue.svg?style=flat)](https://coveralls.io/r/yuanqing/segue)

> Enqueue functions, and call them in series.

## Features

- Enqueue asynchronous functions to be called in series
- Pause or resume the calling of functions in the queue
- Optionally repeat the entire sequence of function calls indefinitely
- Small as it gets; 0.67 KB [minified](https://github.com/yuanqing/segue/blob/master/segue.min.js), or 0.41 KB minified and gzipped
- Error handling

## Quick start

There is [a simple, runnable example](https://github.com/yuanqing/segue/blob/master/example/index.js) you can play with:

```
$ git clone https://github.com/yuanqing/segue
$ cd segue
$ node example/index.js
```

There are also [tests](https://github.com/yuanqing/segue/blob/master/test/index.js).

## Example

We first initialise our `queue` of functions by calling `segue`, passing in a `doneCb` callback:

```js
var segue = require('segue');

var doneCb = function(err) {
  if (err) {
    throw err;
  }
};

var queue = segue(doneCb);
```

`doneCb` is called when all the functions in queue have run, or if an error had occurred in one of the functions.

Suppose that we have two functions, `x` and `y`&hellip;

```js
var x = function(cb, a) {
  console.log(a); //=> 1
  setTimeout(function() {
    cb();
  }, 100);
};

var y = function(cb, a, b) {
  console.log(a, b); //=> 2, 3
  cb();
};
```

&hellip;which we add into the `queue` via `push()`:

```js
queue.push(x, 1)
     .push(y, 2, 3);
```

Then, call `run()` to kick off the sequence of function calls:

```js
queue.run();
```

The function `x` will be called with the argument `1`. After 100 milliseconds, `x` finishes execution, and function `y` is called with the arguments `2` and `3`.

Note that every function added into the `queue` takes a `cb` callback as the first argument. Each function must call `cb` to signal that it has finished execution. As is convention, `cb` takes an `err` as its first argument. If `err` is truthy, the `doneCb` callback is called with said `err`, and no more functions in the `queue` are run.

### Pause, resume

We can pause the calling of functions in the queue on-the-fly by calling `pause()`. This method takes an optional callback that is called when the currently-running function has finished execution:

```js
queue.pause(function() {
  console.log(queue.isRunning()); //=> false
});
```

See that here, we&rsquo;ve also used the `isRunning()` method.

To resume the calling of functions, call `run()`:

```js
queue.run();
console.log(queue.isRunning()); //=> true
```

### Repeat

Finally, note that we can also repeat the entire sequence of function calls indefinitely. Simply pass in `opts` with `opts.repeat` set to `true` when initialising the queue:

```js
var queue = segue(doneCb, { repeat: true });
```

## API

```js
var segue = require('segue');
```

See [Usage](#usage).

### var queue = segue([doneCb, opts])

Initialises the function `queue`.

- The `doneCb` callback is called when all the functions in `queue` have run, or if an error had occurred in one of the function calls. The signature of `doneCb` is `(err)`.
- Set `opts.repeat` to `true` to repeat the sequence of function calls indefinitely.

### queue.push(fn [, arg1, arg2, &hellip;])

Adds a function `fn` into the `queue`, and returns the `queue`. The `fn` will be called with a `cb` callback, followed by the arguments specified here. In other words, the signature `fn` is `(cb, [, arg1, arg2, ...])`.

`fn` must call `cb` to signal that it has finished execution. If `err` is truthy, the `doneCb` callback is called with said `err`, and no more functions in the `queue` are run.

### queue.run()

Starts (or resumes) the sequence of function calls, and returns the `queue`.

### queue.pause([pauseCb])

Pauses the sequence of function calls, and returns the `queue`. Calls the optional `pauseCb` callback when the queue is paused.

### queue.isRunning()

Returns `true` if a function in the queue is running, else returns `false`.

## Installation

Install via [npm](https://npmjs.com):

```
$ npm i --save segue
```

Install via [bower](http://bower.io):

```
$ bower i --save yuanqing/segue
```

To use Segue in the browser, include [the minified script](https://github.com/yuanqing/segue/blob/master/segue.min.js) in your HTML:

```html
<body>
  <script src="path/to/segue.min.js"></script>
  <script>
    // `segue` available here
  </script>
</body>
```

## License

[MIT](https://github.com/yuanqing/segue/blob/master/LICENSE)
