// Taller interactivo 1.3 — hasta 3 planos ax+by+cz=d (sistema 3x3, o 2x3 si se desactiva el
// plano 3), clasificados en vivo por eliminación de Gauss-Jordan y dibujados en 3D para ver
// cómo se intersecan.
(function () {
  const div = document.getElementById("plotTaller");
  if (!div) return;

  const IDS = ["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3"];
  const COLORES = ["#1f77b4", "#d62728", "#2ca02c"];
  const RANGO = 6;
  const N = 9;

  function val(id) {
    return parseFloat(document.getElementById(id).value) || 0;
  }

  function fmt(n) {
    return Number(n.toFixed(3)).toString();
  }

  // Malla de puntos del plano ax+by+cz=d, parametrizada con dos direcciones ortogonales al
  // vector normal (a,b,c). Funciona para cualquier orientación del plano, incluidos los
  // verticales (c=0), a diferencia de despejar z = (d-ax-by)/c.
  function mallaPlano(a, b, c, d, rango, n) {
    const normal = [a, b, c];
    const normaN = Math.hypot(a, b, c);
    if (normaN < 1e-9) return null; // "0=0" o "0=d con d≠0": no es un plano bien definido

    let base = Math.abs(a) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    let e1 = cruz(normal, base);
    let normaE1 = Math.hypot(...e1);
    if (normaE1 < 1e-9) { base = [0, 0, 1]; e1 = cruz(normal, base); normaE1 = Math.hypot(...e1); }
    e1 = e1.map((v) => v / normaE1);
    let e2 = cruz(normal, e1);
    const normaE2 = Math.hypot(...e2) || 1;
    e2 = e2.map((v) => v / normaE2);

    // Punto de referencia sobre el plano: p0 = normal * d / |normal|^2 (proyección del origen).
    const p0 = normal.map((v) => (v * d) / (normaN * normaN));

    const X = [], Y = [], Z = [];
    for (let i = 0; i < n; i++) {
      const s = -rango + (2 * rango * i) / (n - 1);
      const filaX = [], filaY = [], filaZ = [];
      for (let j = 0; j < n; j++) {
        const t = -rango + (2 * rango * j) / (n - 1);
        filaX.push(p0[0] + s * e1[0] + t * e2[0]);
        filaY.push(p0[1] + s * e1[1] + t * e2[1]);
        filaZ.push(p0[2] + s * e1[2] + t * e2[2]);
      }
      X.push(filaX); Y.push(filaY); Z.push(filaZ);
    }
    return { x: X, y: Y, z: Z };
  }

  function cruz(u, v) {
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  }

  // Eliminación de Gauss-Jordan con pivoteo parcial sobre una matriz aumentada m×4 (3 incógnitas).
  function gaussJordan(filas) {
    const M = filas.map((r) => r.slice());
    const m = M.length;
    let fila = 0;
    const pivoteCols = [];
    for (let col = 0; col < 3 && fila < m; col++) {
      let piv = fila;
      for (let i = fila + 1; i < m; i++) {
        if (Math.abs(M[i][col]) > Math.abs(M[piv][col])) piv = i;
      }
      if (Math.abs(M[piv][col]) < 1e-9) continue;
      [M[fila], M[piv]] = [M[piv], M[fila]];
      const pivVal = M[fila][col];
      for (let j = 0; j <= 3; j++) M[fila][j] /= pivVal;
      for (let i = 0; i < m; i++) {
        if (i === fila) continue;
        const factor = M[i][col];
        if (Math.abs(factor) > 1e-12) {
          for (let j = 0; j <= 3; j++) M[i][j] -= factor * M[fila][j];
        }
      }
      pivoteCols.push(col);
      fila++;
    }
    let inconsistente = false;
    for (let i = fila; i < m; i++) {
      if (Math.abs(M[i][3]) > 1e-9) inconsistente = true;
    }
    return { rref: M, rank: fila, pivoteCols, inconsistente };
  }

  function clasificar(ecuaciones) {
    const { rank, pivoteCols, inconsistente, rref } = gaussJordan(ecuaciones);
    const nombres = ["x", "y", "z"];
    if (inconsistente) {
      return `<b class="warn">Sistema inconsistente</b>: la eliminación produce una fila `
        + `\`[0 0 0 | c]\` con c&ne;0. No hay solución (los planos no tienen un punto común a todos).`;
    }
    if (rank === 3) {
      const sol = pivoteCols.map((c, i) => `${nombres[c]} = ${fmt(rref[i][3])}`).join(", ");
      return `<b class="ok">Solución única</b>: los tres planos se cortan en un solo punto, ${sol}.`;
    }
    const libres = nombres.filter((_, i) => !pivoteCols.includes(i));
    const tipo = ecuaciones.length === 3 ? "recta o plano" : "recta o plano";
    return `<b class="ok">Infinitas soluciones</b> (rango ${rank} &lt; 3): `
      + `${libres.length} variable(s) libre(s) — ${libres.join(", ")}. `
      + `El conjunto solución es ${rank === 2 ? "una recta" : "un plano"} en &#8477;&sup3;.`;
  }

  function dibujar() {
    const incluirEc3 = document.getElementById("incluirEc3").checked;
    document.getElementById("fieldsetEc3").style.opacity = incluirEc3 ? "1" : "0.4";

    const ecuaciones = [
      [val("a1"), val("b1"), val("c1"), val("d1")],
      [val("a2"), val("b2"), val("c2"), val("d2")],
    ];
    if (incluirEc3) ecuaciones.push([val("a3"), val("b3"), val("c3"), val("d3")]);

    const traces = [];
    ecuaciones.forEach(([a, b, c, d], i) => {
      const malla = mallaPlano(a, b, c, d, RANGO, N);
      if (malla) {
        traces.push({
          ...malla,
          type: "surface",
          opacity: 0.5,
          colorscale: [[0, COLORES[i]], [1, COLORES[i]]],
          showscale: false,
          name: `plano ${i + 1}`,
        });
      }
    });

    const layout = {
      margin: { t: 10, r: 10, b: 10, l: 10 },
      scene: {
        xaxis: { title: "x", range: [-RANGO, RANGO] },
        yaxis: { title: "y", range: [-RANGO, RANGO] },
        zaxis: { title: "z", range: [-RANGO, RANGO] },
      },
      showlegend: false,
    };
    Plotly.react(div, traces, layout, { displayModeBar: false, responsive: true });

    document.getElementById("resTaller").innerHTML =
      `Sistema: ${ecuaciones.map((e, i) => `${fmt(e[0])}x + ${fmt(e[1])}y + ${fmt(e[2])}z = ${fmt(e[3])}`).join(" &nbsp;·&nbsp; ")}`
      + `<br>${clasificar(ecuaciones)}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    IDS.forEach((id) => document.getElementById(id).addEventListener("input", dibujar));
    document.getElementById("incluirEc3").addEventListener("change", dibujar);
    dibujar();
  });
})();
