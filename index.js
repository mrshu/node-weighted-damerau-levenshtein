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


module.exports = function dldist(s1, s2, opts = {}) {
  const insWeight = 'insWeight' in opts ? opts.insWeight : 1;
  const delWeight = 'delWeight' in opts ? opts.delWeight : 1;
  const subWeight = 'subWeight' in opts ? opts.subWeight : 1;
  const useDamerau = 'useDamerau' in opts ? opts.useDamerau : true;
  let d = [];

  if (s1.length === 0) {
    // if s1 string is empty, just insert the s2 string
    return s2.length * insWeight;
  }

  if (s2.length === 0) {
    // if s2 string is empty, just delete the s1 string
    return s1.length * delWeight;
  }

  // Init the matrix
  for (let i = 0; i <= s1.length; i += 1) {
    d[i] = [];
    d[i][0] = i * delWeight;
  }

  for (let j = 0; j <= s2.length; j += 1) {
    d[0][j] = j * insWeight;
  }

  for (let i = 1; i <= s1.length; i += 1) {
    for (let j = 1; j <= s2.length; j += 1) {
      let subCostIncrement = subWeight;
      if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
        subCostIncrement = 0;
      }

      const delCost = d[i - 1][j] + delWeight;
      const insCost = d[i][j - 1] + insWeight;
      const subCost = d[i - 1][j - 1] + subCostIncrement;

      let min = delCost;
      if (insCost < min) min = insCost;
      if (subCost < min) min = subCost;


      if (useDamerau) {
        if (i > 1 && j > 1
          && s1.charAt(i - 1) === s2.charAt(j - 2)
          && s1.charAt(i - 2) === s2.charAt(j - 1)) {
          const transCost = d[i - 2][j - 2] + subCostIncrement;

          if (transCost < min) min = transCost;
        }
      }


      d[i][j] = min;
    }
  }

  return d[s1.length][s2.length];
};
