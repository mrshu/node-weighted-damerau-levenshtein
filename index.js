/*
 * Copyright 2019 Marek Suppa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


const DEFAULT_OPTIONS = Object.freeze({
  insWeight: 1,
  delWeight: 1,
  subWeight: 1,
  useDamerau: true,
});

const NUMERIC_OPTIONS = ['insWeight', 'delWeight', 'subWeight'];
const ALLOWED_OPTIONS = new Set([...NUMERIC_OPTIONS, 'useDamerau']);

function describeValue(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function assertString(value, name) {
  if (typeof value !== 'string') {
    throw new TypeError(`"${name}" must be a string. Received ${describeValue(value)}.`);
  }
}

function assertPlainOptionsObject(options) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError(`"opts" must be a plain object when provided. Received ${describeValue(options)}.`);
  }

  const prototype = Object.getPrototypeOf(options);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError('"opts" must be a plain object.');
  }
}

function validateWeight(name, value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`"${name}" must be a finite number. Received ${describeValue(value)}.`);
  }

  if (value < 0) {
    throw new RangeError(`"${name}" must be greater than or equal to 0.`);
  }
}

function validateUseDamerau(value) {
  if (typeof value !== 'boolean') {
    throw new TypeError(`"useDamerau" must be a boolean. Received ${describeValue(value)}.`);
  }
}

function normalizeOptions(options) {
  if (options === undefined) return DEFAULT_OPTIONS;

  assertPlainOptionsObject(options);

  const normalized = {
    insWeight: DEFAULT_OPTIONS.insWeight,
    delWeight: DEFAULT_OPTIONS.delWeight,
    subWeight: DEFAULT_OPTIONS.subWeight,
    useDamerau: DEFAULT_OPTIONS.useDamerau,
  };

  for (const key of Object.keys(options)) {
    if (!ALLOWED_OPTIONS.has(key)) {
      throw new TypeError(`Unknown option "${key}". Allowed options are insWeight, delWeight, subWeight, useDamerau.`);
    }

    normalized[key] = options[key];
  }

  for (const key of NUMERIC_OPTIONS) {
    validateWeight(key, normalized[key]);
  }
  validateUseDamerau(normalized.useDamerau);

  return normalized;
}

function dldist(s1, s2, opts) {
  assertString(s1, 's1');
  assertString(s2, 's2');

  const { insWeight, delWeight, subWeight, useDamerau } = normalizeOptions(opts);
  const sourceLength = s1.length;
  const targetLength = s2.length;

  if (sourceLength === 0) {
    return targetLength * insWeight;
  }

  if (targetLength === 0) {
    return sourceLength * delWeight;
  }

  const matrix = Array.from({ length: sourceLength + 1 }, () => new Array(targetLength + 1));

  for (let i = 0; i <= sourceLength; i += 1) {
    matrix[i][0] = i * delWeight;
  }

  for (let j = 0; j <= targetLength; j += 1) {
    matrix[0][j] = j * insWeight;
  }

  for (let i = 1; i <= sourceLength; i += 1) {
    for (let j = 1; j <= targetLength; j += 1) {
      const substitutionCost = s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : subWeight;

      const deleteCost = matrix[i - 1][j] + delWeight;
      const insertCost = matrix[i][j - 1] + insWeight;
      const substituteCost = matrix[i - 1][j - 1] + substitutionCost;

      let minCost = deleteCost;
      if (insertCost < minCost) minCost = insertCost;
      if (substituteCost < minCost) minCost = substituteCost;

      if (
        useDamerau
        && i > 1
        && j > 1
        && s1.charAt(i - 1) === s2.charAt(j - 2)
        && s1.charAt(i - 2) === s2.charAt(j - 1)
      ) {
        const transpositionCost = matrix[i - 2][j - 2] + substitutionCost;
        if (transpositionCost < minCost) minCost = transpositionCost;
      }

      matrix[i][j] = minCost;
    }
  }

  return matrix[sourceLength][targetLength];
}

module.exports = dldist;
module.exports.default = dldist;
