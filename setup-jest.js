// eslint-disable-next-line no-undef
expect.extend({
  toBeCloseTo(received, expected, precision = 2) {
    const pass = Math.abs(received - expected) < precision;
    return {
      pass,
      message: () =>
        `expected ${received} to be close to ${expected} with precision of +/- ${precision}`,
    };
  },
});
