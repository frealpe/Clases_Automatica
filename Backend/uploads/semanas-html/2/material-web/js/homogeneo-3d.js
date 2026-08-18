// Taller interactivo 1.4 — dos planos homogéneos (por el origen) editables: a1x+b1y+c1z=0,
// a2x+b2y+c2z=0. Si son independientes, la intersección es una recta por el origen (dirección
// = producto cruz de las normales); si son múltiplos entre sí (mismo plano), la intersección es
// ese plano completo — el caso del ejemplo de notas.tex.
(function () {
  const div = document.getElementById("plotHomogeneo");
  if (!div) return;

  const IDS = ["ha1", "hb1", "hc1", "ha2", "hb2", "hc2"];
  const RANGO = 4;
  const N = 9;

  function val(id) {
    return parseFloat(document.getElementById(id).value) || 0;
  }
  function fmt(n) {
    return Number(n.toFixed(3)).toString();
  }
  function cruz(u, v) {
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  }

  // Malla de un plano por el origen con normal (a,b,c), parametrizada con dos direcciones
  // ortogonales a la normal (válido para cualquier orientación, incluidos los planos verticales).
  function mallaPlanoOrigen(a, b, c, rango, n) {
    const normal = [a, b, c];
    const normaN = Math.hypot(a, b, c);
    if (normaN < 1e-9) return null; // "0=0": ecuación trivial, no restringe nada

    let base = Math.abs(a) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    let e1 = cruz(normal, base);
    let normaE1 = Math.hypot(...e1);
    if (normaE1 < 1e-9) { base = [0, 0, 1]; e1 = cruz(normal, base); normaE1 = Math.hypot(...e1); }
    e1 = e1.map((v) => v / normaE1);
    let e2 = cruz(normal, e1);
    const normaE2 = Math.hypot(...e2) || 1;
    e2 = e2.map((v) => v / normaE2);

    const X = [], Y = [], Z = [];
    for (let i = 0; i < n; i++) {
      const s = -rango + (2 * rango * i) / (n - 1);
      const filaX = [], filaY = [], filaZ = [];
      for (let j = 0; j < n; j++) {
        const t = -rango + (2 * rango * j) / (n - 1);
        filaX.push(s * e1[0] + t * e2[0]);
        filaY.push(s * e1[1] + t * e2[1]);
        filaZ.push(s * e1[2] + t * e2[2]);
      }
      X.push(filaX); Y.push(filaY); Z.push(filaZ);
    }
    return { x: X, y: Y, z: Z };
  }

  function dibujar() {
    const n1 = [val("ha1"), val("hb1"), val("hc1")];
    const n2 = [val("ha2"), val("hb2"), val("hc2")];
    const norma1 = Math.hypot(...n1), norma2 = Math.hypot(...n2);

    const traces = [
      { x: [0], y: [0], z: [0], mode: "markers", type: "scatter3d",
        marker: { size: 6, color: "#d62728" }, name: "solución trivial (0,0,0)" },
    ];

    let mensaje;
    if (norma1 < 1e-9 && norma2 < 1e-9) {
      mensaje = "Las dos ecuaciones son triviales (0=0): el conjunto solución es todo &#8477;&sup3;.";
    } else if (norma1 < 1e-9 || norma2 < 1e-9) {
      const activa = norma1 < 1e-9 ? n2 : n1;
      const malla = mallaPlanoOrigen(activa[0], activa[1], activa[2], RANGO, N);
      if (malla) traces.push({ ...malla, type: "surface", opacity: 0.55, colorscale: [[0, "#38bdf8"], [1, "#1f77b4"]], showscale: false });
      mensaje = "Una de las ecuaciones es trivial (0=0): el conjunto solución es el plano de la otra ecuación.";
    } else {
      const c = cruz(n1, n2);
      const normaC = Math.hypot(...c);

      const m1 = mallaPlanoOrigen(n1[0], n1[1], n1[2], RANGO, N);
      const m2 = mallaPlanoOrigen(n2[0], n2[1], n2[2], RANGO, N);

      if (normaC > 1e-6) {
        // Planos independientes: la recta solución tiene dirección = n1 × n2.
        if (m1) traces.push({ ...m1, type: "surface", opacity: 0.35, colorscale: [[0, "#1f77b4"], [1, "#1f77b4"]], showscale: false });
        if (m2) traces.push({ ...m2, type: "surface", opacity: 0.35, colorscale: [[0, "#d62728"], [1, "#d62728"]], showscale: false });
        const dir = c.map((v) => v / normaC);
        const L = RANGO * 1.4;
        traces.push({
          x: [-L * dir[0], L * dir[0]], y: [-L * dir[1], L * dir[1]], z: [-L * dir[2], L * dir[2]],
          mode: "lines", type: "scatter3d", line: { color: "#16a34a", width: 8 }, name: "recta solución",
        });
        mensaje = `<b class="ok">Recta por el origen</b>, dirección proporcional a `
          + `(${fmt(c[0])}, ${fmt(c[1])}, ${fmt(c[2])}) = n&#8321; &times; n&#8322;.`;
      } else {
        // n1 × n2 ≈ 0: normales paralelas => mismo plano (ambos pasan por el origen).
        if (m1) traces.push({ ...m1, type: "surface", opacity: 0.6, colorscale: [[0, "#38bdf8"], [1, "#1f77b4"]], showscale: false });
        mensaje = `<b class="ok">Mismo plano</b>: las dos ecuaciones son múltiplos una de la otra `
          + `(n&#8321; &times; n&#8322; &asymp; 0). El conjunto solución es el plano completo.`;
      }
    }

    const layout = {
      margin: { t: 10, r: 10, b: 10, l: 10 },
      scene: {
        xaxis: { title: "x₁", range: [-RANGO, RANGO] },
        yaxis: { title: "x₂", range: [-RANGO, RANGO] },
        zaxis: { title: "x₃", range: [-RANGO, RANGO] },
      },
      showlegend: false,
    };
    Plotly.react(div, traces, layout, { displayModeBar: false, responsive: true });

    const resDiv = document.getElementById("resHomogeneo");
    if (resDiv) {
      resDiv.innerHTML =
        `Ecuación 1: ${fmt(n1[0])}x&#8321; + ${fmt(n1[1])}x&#8322; + ${fmt(n1[2])}x&#8323; = 0 &nbsp;&nbsp;`
        + `Ecuación 2: ${fmt(n2[0])}x&#8321; + ${fmt(n2[1])}x&#8322; + ${fmt(n2[2])}x&#8323; = 0<br>${mensaje}`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    IDS.forEach((id) => document.getElementById(id).addEventListener("input", dibujar));
    dibujar();
  });
})();
