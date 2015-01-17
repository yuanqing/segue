# Segue.js [![npm Version](http://img.shields.io/npm/v/segue.svg?style=flat)](https://www.npmjs.org/package/segue) [![Build Status](https://img.shields.io/travis/yuanqing/segue.svg?style=flat)](https://travis-ci.org/yuanqing/segue) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/segue.svg?style=flat)](https://coveralls.io/r/yuanqing/segue)

> Enqueue functions, and call them in series.

## Features

- Repeat the entire sequence of function calls indefinitely
- Small as it gets; 0.49 KB [minified](https://github.com/yuanqing/segue/blob/master/segue.min.js), or 0.32 KB minified and gzipped
- Error handling

Segue is particularly useful for when you have an indeterminate number of asynchronous functions that you want to call in series.

## Quick start

There is [a runnable example](https://github.com/yuanqing/segue/blob/master/example/index.js) you can play with:

```bash
$ git clone https://github.com/yuanqing/segue
$ cd segue/example
$ node index.js
```

There are also [tests](https://github.com/yuanqing/segue/blob/master/test/index.js).

## Usage

We first initialise a `queue` of functions by calling `segue`, passing in an error callback `cb`:

```js
var cb = function(err) {
  if (err) {
    throw err;
  }
};

var queue = segue(cb);
```

Suppose that we have two functions, `x` and `y`&hellip;

```js
var x = function(done, a) {
  console.log(a); //=> 1
  setTimeout(function() {
    done();
  }, 100);
};

var y = function(done, a, b) {
  console.log(a, b); //=> 2, 3
  done();
};
```

&hellip;which we then add into the `queue`:

```js
queue(x, 1)(y, 2, 3);
```

Because `queue` is initially empty, `x` is called immediately with the argument `1`. After 100 milliseconds, `x` finishes execution, and `y` is called with the single argument `2` and `3`.

Every function in the `queue` takes a `done` callback as the first argument, and must call `done` to signal that it has finished execution. As is convention, `done` callback takes an `err` as its first argument. If `done` is called with a truthy `err`, the error callback (ie. `cb`) is called with the `err`, and no more functions in the queue are run.

### Repeat

To repeat the entire sequence of function calls indefinitely, simply pass in an `opts` with `opts.repeat` set to `true`:

```js
var queue = segue(cb, { repeat: true });
```

## API

See [Usage](#usage).

### segue([cb , opts])

Initialises the function queue.

- `cb` is the error callback that takes `err` as the first argument.
- Set `opts.repeat` to `true` to repeat the sequence of function calls indefinitely.

### segue(fn [, arg1, arg2, &hellip;])

Adds `fn` into the function queue. The `fn` will be called with a `done` callback, followed by the arguments specified here (`arg1`, `arg2`, and so on).

`fn` must call `done` to signal that it has finished execution. If `done` is called with a truthy `err`, the error callback (ie. `cb`) will be called once with the `err`, and no more functions in the queue are run.

## Installation

Install via [npm](https://npmjs.com/):

```bash
$ npm i --save segue
```

Install via [bower](http://bower.io/):

```bash
$ bower i --save yuanqing/segue
```

To use Segue in the browser, include [the minified script](https://github.com/yuanqing/segue/blob/master/segue.min.js) in your HTML:

```html
<body>
  <!-- ... -->
  <script src="path/to/segue.min.js"></script>
  <script>
    // segue available here
  </script>
</body>
```

## Changelog

- 1.0.0
  - Major rewrite/clean up, with a significant drop in file size
  - Write tests using [tape](https://github.com/substack/tape)
  - Remove ability to pass arguments between functions
  - Remove pause/resume functionality
  - Drop Gulp
- 0.2.0
  - Add pause/resume functionality
  - Add repeat functionality
  - Add a Browserified version of the module
  - Use [Gulp](http://gulpjs.com/) as build system
- 0.1.0
  - Initial release

## License

[MIT license](https://github.com/yuanqing/segue/blob/master/LICENSE)
