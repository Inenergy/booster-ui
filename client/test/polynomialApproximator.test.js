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
    { x: 0.5, y: 0.705},
    { x: 0.6, y: 0.495},
    { x: 0.7, y: 0.426},
    { x: 0.8, y: 0.357},
    { x: 0.9, y: 0.368},
    { x: 1.0, y: 0.406},
    { x: 1.1, y: 0.549},
    { x: 1.2, y: 0.768},
  ];
  const [a, b, c] = approximate(points, 3);
  expect(a).toBeCloseTo(2.529);
  expect(b).toBeCloseTo(-5.2175);
  expect(c).toBeCloseTo(3.1154);
});
