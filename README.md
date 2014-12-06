# Segue.js [![Experimental](http://img.shields.io/badge/stability-experimental-red.svg?style=flat)](https://github.com/yuanqing/segue) [![npm Version](http://img.shields.io/npm/v/segue.svg?style=flat)](https://www.npmjs.org/package/segue) [![Build Status](https://img.shields.io/travis/yuanqing/segue.svg?style=flat)](https://travis-ci.org/yuanqing/segue) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/segue.svg?style=flat)](https://coveralls.io/r/yuanqing/segue)

> Enqueue functions, and call them in series.

## Features

- Pass arguments from one function in the queue to the next
- Repeat the entire sequence of function calls indefinitely
- Pause or resume the calling of functions in the queue
- Small as it gets; 1.2 KB [minified](https://github.com/yuanqing/segue/blob/master/dist/segue.min.js), or 0.6 KB minified and gzipped
- Error handling

Segue is particularly useful for when you have an indeterminate number of asynchronous functions that you want to call in series.

## Quick start

There is [a runnable example](https://github.com/yuanqing/segue/blob/master/example.js) you can play with:

```bash
$ git clone https://github.com/yuanqing/segue
$ cd segue
$ node example.js
```

There are also [tests](https://github.com/yuanqing/segue/blob/master/spec/segue.spec.js).

## Usage

We first initialise a `queue` of functions by calling `segue`, passing in an error handler `cb`:

```js
var cb = function(err) {
  if (err) {
    throw err;
  }
};

var queue = segue(cb);
```

Suppose that we have two functions, `foo` and `bar`&hellip;

```js
var foo = function(a) {
  console.log(a); //=> 'Hello'
  setTimeout(function() {
    this(null, a);
  }.bind(this), 100);
};

var bar = function(a, b) {
  console.log(a + ', ' + b); //=> 'Hello, World!'
  this(null, a, b);
};
```

&hellip;which we then add to `queue`:

```js
queue(foo, 'Hello')(bar, 'World!');
```

Because `queue` is initially empty, `foo` is called immediately with the `'Hello'` argument. After 100 milliseconds, `foo` finishes execution, and `bar` is called.

Each function in `queue` must call `this` to signal that it has finished execution. As is convention, the `this` callback takes an `err` as its first argument.

- If `err` is truthy, the error callback (ie. `cb`) is called with the `err`, and no more functions in the queue are run.

- If `err` is falsy&hellip;

  - &hellip;and `queue` is non-empty, the next function in the `queue` is called. The next function receives all the arguments except `err` that had been passed to the `this` callback.

    So, in our toy example, `bar` will be called with two arguments:

    1. The value for `a` was from the `this` callback in `foo`.
    2. The value for `b` was from the initial call to add `bar` to `queue`.

  - &hellip;and `queue` is empty, all the arguments except `err` that had been passed to the `this` callback are saved. These arguments will be passed to the next function that is added to the `queue`.

    Notice that the `this` callback in `bar` was called with `a` and `b`; the next function that is added into `queue` will receive both these arguments.

---

To repeat the entire sequence of function calls indefinitely, simply pass in `true` as the second parameter in our initial call to `segue`:

```js
// initialise the `queue`
var queue = segue(cb, true);

// add functions to the `queue`
queue(foo, 'Hello')(bar, 'World!');
```

---

To pause or resume the calling of functions on the fly (say, in response to some user interaction), invoke `queue` without arguments:

```js
// pause or resume the sequence on clicking `button`
button.addEventListener('click', function() {
  queue();
});
```

## API

See [Usage](#usage).

### segue([cb, repeat])

Initialises the function queue.

- `cb` &mdash; Error handler that takes `err` as the first argument.
- `repeat` &mdash; Whether to repeat the entire sequence of function calls indefinitely.

### segue(fn [, arg1, arg2, &hellip;])

Adds `fn` to the function queue. When called, `fn` will be passed the specified arguments.

### segue()

Pauses or resumes the calling of functions in the function queue. (Note that if `repeat` is false, and all the functions in the queue have already run, this will have no effect.)

## Installation

Install via [npm](https://www.npmjs.org/package/segue):

```bash
$ npm i --save segue
```

To use Segue in the browser, include [the minified script](https://github.com/yuanqing/segue/blob/master/dist/segue.min.js) in your HTML:

```html
<body>
  <!-- ... -->
  <script src="path/to/dist/segue.min.js"></script>
  <script>
    // segue available here
  </script>
</body>
```

## Changelog

- 0.2.0
  - Add pause/resume functionality
  - Add repeat functionality
  - Add a Browserified version of the module
  - Use Gulp as build system
- 0.1.0
  - Initial release

## License

[MIT license](https://github.com/yuanqing/segue/blob/master/LICENSE)
