// Visualización 3D del conjunto solución del sistema homogéneo de tema-1-4.html:
// x1 + 2x2 - x3 = 0, 2x1 + 4x2 - 2x3 = 0  =>  x1 = -2s + t, x2 = s, x3 = t (s,t libres).
// Dos variables libres => el conjunto solución es un plano por el origen, no una recta.
(function () {
  const div = document.getElementById("plotHomogeneo");
  if (!div) return;

  const N = 9;
  const RANGO = 3;
  const paso = (2 * RANGO) / (N - 1);
  const s = [], t = [];
  for (let i = 0; i < N; i++) {
    s.push(-RANGO + i * paso);
    t.push(-RANGO + i * paso);
  }

  const X = [], Y = [], Z = [];
  for (let i = 0; i < N; i++) {
    const filaX = [], filaY = [], filaZ = [];
    for (let j = 0; j < N; j++) {
      const si = s[i], tj = t[j];
      filaX.push(-2 * si + tj);
      filaY.push(si);
      filaZ.push(tj);
    }
    X.push(filaX);
    Y.push(filaY);
    Z.push(filaZ);
  }

  const plano = {
    x: X, y: Y, z: Z,
    type: "surface",
    opacity: 0.55,
    colorscale: [[0, "#38bdf8"], [1, "#1f77b4"]],
    showscale: false,
    name: "plano solución",
  };

  const origen = {
    x: [0], y: [0], z: [0],
    mode: "markers",
    type: "scatter3d",
    marker: { size: 6, color: "#d62728" },
    name: "solución trivial (0,0,0)",
  };

  const layout = {
    margin: { t: 10, r: 10, b: 10, l: 10 },
    scene: {
      xaxis: { title: "x₁" },
      yaxis: { title: "x₂" },
      zaxis: { title: "x₃" },
    },
    showlegend: false,
  };

  Plotly.newPlot(div, [plano, origen], layout, { displayModeBar: false, responsive: true });
})();
