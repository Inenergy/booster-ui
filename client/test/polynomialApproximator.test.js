const { approximate, gauss } = require('../utils/polynomialApproximator');

test('solves linear equations correctly', () => {
  const solution = gauss(
    [
      [2, 4, 1],
      [5, 2, 1],
      [2, 3, 4],
    ],
    [36, 47, 37]
  );
  expect(solution[0]).toBeCloseTo(7);
  expect(solution[1]).toBeCloseTo(5);
  expect(solution[2]).toBeCloseTo(2);
});

test('approximates exponential function correctly', () => {
  const points = [
    { x: 414, y: 0 },
    { x: 536, y: 500 },
    { x: 661, y: 1000 },
    { x: 756, y: 1500 },
    { x: 825, y: 2000 },
    { x: 875, y: 2500 },
    { x: 912, y: 3000 },
  ];
  const [a, b, c, d] = approximate(points, 4);
  expect(a).toBeCloseTo(-6249.42);
  expect(b).toBeCloseTo(29.4229);
  expect(c).toBeCloseTo(-0.04583);
  expect(d).toBeCloseTo(2.7e-5);
});
