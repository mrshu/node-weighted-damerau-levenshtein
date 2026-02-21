# Weighted Damerau-Levenshtein Distance for Node.js

[![CI](https://github.com/mrshu/node-weighted-damerau-levenshtein/actions/workflows/ci.yml/badge.svg)](https://github.com/mrshu/node-weighted-damerau-levenshtein/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/weighted-damerau-levenshtein.svg)](https://www.npmjs.com/package/weighted-damerau-levenshtein)
[![npm downloads](https://img.shields.io/npm/dm/weighted-damerau-levenshtein.svg)](https://www.npmjs.com/package/weighted-damerau-levenshtein)
[![License: Apache-2.0](https://img.shields.io/npm/l/weighted-damerau-levenshtein.svg)](./LICENSE)

Weighted Damerau-Levenshtein and Levenshtein edit distance with configurable operation costs.
Useful for typo tolerance, fuzzy matching, search ranking, and query correction in TypeScript/JavaScript/Node.js.

## Install

```bash
npm install weighted-damerau-levenshtein
```

Requires Node.js 20 or newer.

## Why this package

- Configurable insertion, deletion, and substitution weights
- Optional transposition support (`useDamerau: true/false`)
- Runtime input validation for safer production usage
- Zero runtime dependencies
- Included TypeScript declarations (`index.d.ts`)

## Usage

```js
const distance = require('weighted-damerau-levenshtein');

// Weighted Damerau-Levenshtein
const a = distance('hello word', 'Hello World!');
// 4 (two substitutions + two insertions)

// Lower insertion cost
const b = distance('hello word', 'Hello World!', { insWeight: 0.5 });
// 3

// Classic Levenshtein (Damerau disabled)
const c = distance('Hi there', 'Hi tehre', { useDamerau: false });
// 2
```

## TypeScript

This package ships with built-in type declarations (`index.d.ts`).

```ts
import distance = require('weighted-damerau-levenshtein');

const score: number = distance('kitten', 'sitting', {
  insWeight: 1,
  delWeight: 1,
  subWeight: 1,
  useDamerau: true,
});
```

## API

`distance(source, target, options?) => number`

Options:

- `insWeight` (`number`, default `1`)
- `delWeight` (`number`, default `1`)
- `subWeight` (`number`, default `1`)
- `useDamerau` (`boolean`, default `true`)

Validation behavior:

- `source` and `target` must be strings
- Weights must be finite numbers greater than or equal to `0`
- `useDamerau` must be a boolean
- Unknown option keys throw a `TypeError`

## Development

```bash
npm install
npm run ci
npm run pack:check
```

`npm run verify` runs lint + tests on any supported Node version.  
`npm run test:coverage` enforces strict 100% coverage thresholds (used in CI on Node 22).

## Release

- CI runs in GitHub Actions from `.github/workflows/ci.yml`
- CI matrix runs `verify` on Node 20/22/24, with Node 25 as a non-blocking smoke check
- Strict 100% coverage enforcement runs on Node 22
- Publishing runs from `.github/workflows/publish.yml` on semver tags (`vX.Y.Z`)
- `npm publish --provenance` requires repository `NPM_TOKEN` and npm publisher setup

## License

Licensed under Apache 2.0. See [LICENSE](./LICENSE).
