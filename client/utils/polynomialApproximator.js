function approximate(points, n) {
  return gauss(...getMatrixFromPoints(points, n));
}

function getMatrixFromPoints(points, n) {
  const pointsX = points.map((p) => p.x);
  const mat = [];
  const yColumn = Array(n).fill(0);
  const powerSum = (arr, p) => arr.reduce((s, a) => s + a ** p, 0);
  for (let i = 0; i < n; ++i) {
    const row = [];
    for (let j = 0; j < n; ++j) {
      row.push(powerSum(pointsX, i + j));
    }
    for (let j = 0; j < points.length; ++j){
      yColumn[i] += points[j].x ** i * points[j].y;
    }
    mat.push(row);
  }
  return [mat, yColumn];
}

function gauss(a, y) {
  const n = y.length;
  let max;
  let k = 0,
    index;
  const eps = 0.00001; // точность
  const x = [];
  while (k < n) {
    // Поиск строки с максимальным a[i][k]
    max = Math.abs(a[k][k]);
    index = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(a[i][k]) > max) {
        max = Math.abs(a[i][k]);
        index = i;
      }
    }
    // Перестановка строк
    if (max < eps) {
      // нет ненулевых диагональных элементов
      throw new Error(
        'Решение получить невозможно из-за нулевого столбца матрицы А'
      );
    }
    for (let j = 0; j < n; j++) {
      let temp = a[k][j];
      a[k][j] = a[index][j];
      a[index][j] = temp;
    }
    let temp = y[k];
    y[k] = y[index];
    y[index] = temp;
    // Нормализация уравнений
    for (let i = k; i < n; i++) {
      let temp = a[i][k];
      if (Math.abs(temp) < eps) continue; // для нулевого коэффициента пропустить
      for (let j = 0; j < n; j++) a[i][j] = a[i][j] / temp;
      y[i] = y[i] / temp;
      if (i == k) continue; // уравнение не вычитать само из себя
      for (let j = 0; j < n; j++) a[i][j] = a[i][j] - a[k][j];
      y[i] = y[i] - y[k];
    }
    k++;
  }
  // обратная подстановка
  for (k = n - 1; k >= 0; k--) {
    x[k] = y[k];
    for (let i = 0; i < k; i++) y[i] = y[i] - a[i][k] * x[k];
  }
  return x;
}

module.exports = {
  approximate,
  gauss,
};
