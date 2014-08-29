# Segue.js [![npm Version](http://img.shields.io/npm/v/segue.svg?style=flat)](https://www.npmjs.org/package/segue) [![Build Status](https://img.shields.io/travis/yuanqing/segue.svg?style=flat)](https://travis-ci.org/yuanqing/segue) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/segue.svg?style=flat)](https://coveralls.io/r/yuanqing/segue)

> Enqueue functions, and call them sequentially.

Supports:
- Passing arguments from one function in the queue to the next
- Error handling

Segue is particularly useful for when there are an indeterminate number of asynchronous functions that we want to call in series.

## Quick start

There is [a runnable example](https://github.com/yuanqing/segue/blob/master/example.js) you can play with:

```bash
$ git clone https://github.com/yuanqing/segue && cd segue
$ node example.js
```

There are also [tests](https://github.com/yuanqing/segue/blob/master/spec/segue.spec.js).

## Usage

We first initialise a `queue` of functions by calling `segue`, and passing it an error handler `cb`:

```js
var cb = function(err) {
  if (err) {throw err; }
};

var queue = segue(cb);
```

Suppose that we have two functions, `foo` and `bar`&hellip;

```js
var foo = function(a) {
  var that = this;
  console.log(a); //=> 'Hello'
  setTimeout(function() {
    that(null, a);
  }, 100);
};

var bar = function(a, b) {
  console.log(a + ', ' + b); //=> 'Hello, World!'
  this(null, a, b);
};
```

&hellip;which we then add to our `queue` like so:

```js
queue(foo, 'Hello')(bar, 'World!');
```

Because the `queue` is initially empty, `foo` is called with the `'Hello'` argument. After 100ms, `foo` finishes execution, and `bar` starts execution.

Note that every function in the `queue` must call `this` to signal that it has finished execution. As is convention, the `this` callback takes an `err` as its first argument.

- If `err` is truthy, the error callback (ie. `cb`) is called with the `err`, and no more functions in the `queue` are run.

- If `err` is falsy&hellip;

  - &hellip;and the `queue` is *empty*, all the arguments except `err` that had been passed to the `this` callback are saved. Said arguments will be passed to the next function that is added to the `queue`.

  - &hellip;and the `queue` is *non-empty*, control flow is handed to the next function in the `queue`. The next function receives all the arguments except `err` that had been passed to the `this` callback.

See that in our toy example, `bar` was called with two arguments:

1. The value for `a` was from the `this` callback in `foo`.
2. The value for `b` was from the initial call to add `bar` to the `queue`.

## Installation

Install via [npm](https://www.npmjs.org/package/segue):

```bash
$ npm i --save segue
```

## License

[MIT license](https://github.com/yuanqing/segue/blob/master/LICENSE)
