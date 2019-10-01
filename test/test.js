const assert = require('assert');

const dldist = require('../index');

describe('Weighted Damerau - Levenshtein', () => {
  describe('Empty strings', () => {
    it('should "insert" the non-empty string into the other one', () => {
      const s1 = '';
      const s2 = 'test';
      assert.equal(dldist(s1, s2), s2.length);
    });

    it('should "delete" the non-empty string', () => {
      const s1 = 'test';
      const s2 = '';
      assert.equal(dldist(s1, s2), s1.length);
    });

    it('should "insert" the non-empty string into the other one with custom weight', () => {
      const s1 = '';
      const s2 = 'test';
      assert.equal(dldist(s1, s2, { insWeight: 5 }), s2.length * 5);
    });

    it('should "delete" the non-empty string with custom weight', () => {
      const s1 = 'test';
      const s2 = '';
      assert.equal(dldist(s1, s2, { delWeight: 5 }), s1.length * 5);
    });

    it('should return zero when both are empty', () => {
      const s1 = '';
      const s2 = '';
      assert.equal(dldist(s1, s2), 0);
    });
  });

  describe('Insertion', () => {
    it('should use insWeight 1 by default', () => {
      const s1 = 'mornin';
      const s2 = 'morning';
      assert.equal(dldist(s1, s2), 1);
    });

    it('should respect the insWeight option', () => {
      const s1 = 'mornin';
      const s2 = 'morning';
      assert.equal(dldist(s1, s2, { insWeight: 0.5 }), 0.5);
    });

    it('should use insertion when prepending a character', () => {
      const s1 = 'orning';
      const s2 = 'morning';
      assert.equal(dldist(s1, s2, { insWeight: 0.5 }), 0.5);
    });

    it('should use insertion when adding characters', () => {
      const s1 = 'morning';
      const s2 = 'morning is nice';
      assert.equal(dldist(s1, s2, { insWeight: 0.5 }), 4);
    });
  });

  describe('Deletion', () => {
    it('should use delWeight 1 by default', () => {
      const s1 = 'morning';
      const s2 = 'mornin';
      assert.equal(dldist(s1, s2), 1);
    });

    it('should respect the delWeight option', () => {
      const s1 = 'morning';
      const s2 = 'mornin';
      assert.equal(dldist(s1, s2, { delWeight: 0.5 }), 0.5);
    });

    it('should use deletion when removing a front character', () => {
      const s1 = 'morning';
      const s2 = 'orning';
      assert.equal(dldist(s1, s2, { delWeight: 0.5 }), 0.5);
    });

    it('should use deletion when removing characters', () => {
      const s1 = 'morning is nice';
      const s2 = 'morning';
      assert.equal(dldist(s1, s2, { delWeight: 0.5 }), 4);
    });
  });

  describe('Substitution', () => {
    it('should use subWeight 1 by default', () => {
      const s1 = 'morning';
      const s2 = 'evening';
      assert.equal(dldist(s1, s2), 3);
    });

    it('should respect the subWeight option', () => {
      const s1 = 'morning';
      const s2 = 'evening';
      assert.equal(dldist(s1, s2, { subWeight: 0.5 }), 1.5);
    });
  });

  describe('Transposition', () => {
    it('should be allowed by default', () => {
      const s1 = 'morning';
      const s2 = 'omrning';
      assert.equal(dldist(s1, s2), 1);
    });

    it('should respect the subWeight option', () => {
      const s1 = 'morning';
      const s2 = 'omrning';
      assert.equal(dldist(s1, s2, { subWeight: 0.5 }), 0.5);
    });

    it('should not work with without useDamerau being set', () => {
      const s1 = 'morning';
      const s2 = 'omrning';
      assert.equal(dldist(s1, s2, { useDamerau: false }), 2);
    });
  });
});
