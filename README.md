# Weighted Damerau–Levenshtein distance

![Travis (.org)](https://img.shields.io/travis/mrshu/node-weighted-damerau-levenshtein) [![Coverage Status](https://coveralls.io/repos/github/mrshu/node-weighted-damerau-levenshtein/badge.svg?branch=master)](https://coveralls.io/github/mrshu/node-weighted-damerau-levenshtein?branch=master) ![NPM](https://img.shields.io/npm/l/weighted-damerau-levenshtein)

A simple Node module that allows you to compute [Damerau–Levenshtein
distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance)
with custom weights for insertion, deletion and/or substitution (they all
default to `1`). It is inspired by the
[damerau-levenshtein](https://github.com/tad-lispy/node-damerau-levenshtein)
and
[damerau-levenshtein-js](https://github.com/fabvalaaah/damerau-levenshtein-js)
packages.

```js
let dldist = require('weighted-damerau-levenshtein');

const d = dldist('hello word', 'Hello World!');
// 4 -> two substitutions and two insertions

const s = dldist('hello word', 'Hello World!', { insWeight: 0.5 });
// 3 -> two substitutions with weight 1 and two insertions with weight 0.5

```

It also optionally allows you to turn-off the "Damerau" part of the
Damerau-Levenshtein distance (i..e the transpositions), which makes it the
standard [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

```js
let dldist = require('weighted-damerau-levenshtein');

const d = dldist('Hi there', 'Hi tehre');
// 1 -> one transpostion (counted with the default subsitution weight)

const s = dldist('Hi there', 'Hi tehre', { useDamerau: false });
// 2 -> one substitution and one deletion (both with default weight)

```

Install
-------

    npm install weighted-damerau-levenshtein


License
-------

Licensed under the terms of the Apache 2.0 license. See the
[LICENSE](./LICENSE) file for more details.
