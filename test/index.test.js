const test = require('node:test');
const assert = require('node:assert/strict');

const dldist = require('../index');

test('happy paths: baseline and weighted distances', async (t) => {
  await t.test('returns 0 for identical strings', () => {
    assert.strictEqual(dldist('morning', 'morning'), 0);
  });

  await t.test('handles empty strings with default and custom weights', () => {
    assert.strictEqual(dldist('', 'test'), 4);
    assert.strictEqual(dldist('test', ''), 4);
    assert.strictEqual(dldist('', 'test', { insWeight: 2 }), 8);
    assert.strictEqual(dldist('test', '', { delWeight: 2 }), 8);
  });

  await t.test('supports insertion, deletion, and substitution weighting', () => {
    assert.strictEqual(dldist('mornin', 'morning'), 1);
    assert.strictEqual(dldist('mornin', 'morning', { insWeight: 0.5 }), 0.5);
    assert.strictEqual(dldist('morning', 'mornin', { delWeight: 0.5 }), 0.5);
    assert.strictEqual(dldist('morning', 'evening'), 3);
    assert.strictEqual(dldist('morning', 'evening', { subWeight: 0.5 }), 1.5);
  });

  await t.test('accepts an options object with a null prototype', () => {
    const opts = Object.create(null);
    opts.insWeight = 0.5;
    assert.strictEqual(dldist('mornin', 'morning', opts), 0.5);
  });
});

test('weighted-operation decision logic', async (t) => {
  await t.test('prefers substitution when substitution is cheaper than delete+insert', () => {
    assert.strictEqual(
      dldist('abc', 'adc', { subWeight: 0.25, insWeight: 1, delWeight: 1 }),
      0.25,
    );
  });

  await t.test('prefers delete+insert when substitution is more expensive', () => {
    assert.strictEqual(
      dldist('abc', 'adc', { subWeight: 3, insWeight: 1, delWeight: 1 }),
      2,
    );
  });

  await t.test('prefers insertion/deletion when those operations are cheaper', () => {
    assert.strictEqual(
      dldist('abc', 'abxc', { insWeight: 0.5, delWeight: 2, subWeight: 2 }),
      0.5,
    );
    assert.strictEqual(
      dldist('abxc', 'abc', { insWeight: 2, delWeight: 0.5, subWeight: 2 }),
      0.5,
    );
  });

  await t.test('allows zero weights and keeps the minimum deterministic', () => {
    assert.strictEqual(dldist('abc', 'xyz', { subWeight: 0 }), 0);
    assert.strictEqual(dldist('abc', '', { delWeight: 0 }), 0);
    assert.strictEqual(dldist('', 'abc', { insWeight: 0 }), 0);
  });
});

test('transposition behavior (including repeated characters)', async (t) => {
  await t.test('counts one adjacent transposition by default', () => {
    assert.strictEqual(dldist('ab', 'ba'), 1);
  });

  await t.test('uses substitution weight for transposition cost', () => {
    assert.strictEqual(dldist('ab', 'ba', { subWeight: 0.5 }), 0.5);
  });

  await t.test('handles transposition with repeated characters', () => {
    assert.strictEqual(dldist('aab', 'aba'), 1);
    assert.strictEqual(dldist('aabb', 'abab'), 1);
    assert.strictEqual(dldist('book', 'boko'), 1);
  });
});

test('useDamerau: false behavior', async (t) => {
  await t.test('disables transposition optimization for simple swaps', () => {
    assert.strictEqual(dldist('ab', 'ba', { useDamerau: false }), 2);
    assert.strictEqual(dldist('abcd', 'abdc', { useDamerau: false }), 2);
  });

  await t.test('disables transposition optimization for repeated-character swaps', () => {
    assert.strictEqual(dldist('aab', 'aba', { useDamerau: false }), 2);
    assert.strictEqual(dldist('aabb', 'abab', { useDamerau: false }), 2);
    assert.strictEqual(dldist('book', 'boko', { useDamerau: false }), 2);
  });

  await t.test('still computes non-transposition edits normally', () => {
    assert.strictEqual(
      dldist('morning', 'evening', { useDamerau: false }),
      3,
    );
    assert.strictEqual(
      dldist('morning', 'evening', { useDamerau: false, subWeight: 0.5 }),
      1.5,
    );
  });
});

test('invalid input handling: non-string inputs', async (t) => {
  await t.test('rejects non-string s1', () => {
    assert.throws(
      () => dldist(7, 'abc'),
      new TypeError('"s1" must be a string. Received number.'),
    );
    assert.throws(
      () => dldist(['a'], 'abc'),
      new TypeError('"s1" must be a string. Received array.'),
    );
  });

  await t.test('rejects non-string s2', () => {
    assert.throws(
      () => dldist('abc', true),
      new TypeError('"s2" must be a string. Received boolean.'),
    );
    assert.throws(
      () => dldist('abc', ['a']),
      new TypeError('"s2" must be a string. Received array.'),
    );
  });
});

test('invalid options handling: opts shape and unknown keys', async (t) => {
  await t.test('rejects opts when not a plain object', () => {
    assert.throws(
      () => dldist('a', 'b', null),
      new TypeError('"opts" must be a plain object when provided. Received null.'),
    );
    assert.throws(
      () => dldist('a', 'b', []),
      new TypeError('"opts" must be a plain object when provided. Received array.'),
    );
    assert.throws(
      () => dldist('a', 'b', 1),
      new TypeError('"opts" must be a plain object when provided. Received number.'),
    );
    assert.throws(
      () => dldist('a', 'b', new Date()),
      new TypeError('"opts" must be a plain object.'),
    );
  });

  await t.test('rejects unknown option names', () => {
    assert.throws(
      () => dldist('a', 'b', { unknown: 1 }),
      new TypeError('Unknown option "unknown". Allowed options are insWeight, delWeight, subWeight, useDamerau.'),
    );
  });

  await t.test('rejects non-boolean useDamerau', () => {
    assert.throws(
      () => dldist('ab', 'ba', { useDamerau: 'false' }),
      new TypeError('"useDamerau" must be a boolean. Received string.'),
    );
    assert.throws(
      () => dldist('ab', 'ba', { useDamerau: 0 }),
      new TypeError('"useDamerau" must be a boolean. Received number.'),
    );
  });
});

test('invalid options handling: numeric weights', async (t) => {
  const numericOptions = ['insWeight', 'delWeight', 'subWeight'];

  for (const optionName of numericOptions) {
    await t.test(`rejects non-finite ${optionName}`, () => {
      assert.throws(
        () => dldist('a', 'b', { [optionName]: '1' }),
        new TypeError(`"${optionName}" must be a finite number. Received string.`),
      );
      assert.throws(
        () => dldist('a', 'b', { [optionName]: NaN }),
        new TypeError(`"${optionName}" must be a finite number. Received number.`),
      );
      assert.throws(
        () => dldist('a', 'b', { [optionName]: Infinity }),
        new TypeError(`"${optionName}" must be a finite number. Received number.`),
      );
    });

    await t.test(`rejects negative ${optionName}`, () => {
      assert.throws(
        () => dldist('a', 'b', { [optionName]: -1 }),
        new RangeError(`"${optionName}" must be greater than or equal to 0.`),
      );
    });
  }
});
