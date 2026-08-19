// Taller interactivo 1.2 — dos rectas, tres casos posibles.
(function () {
  const ids = ["a1", "b1", "c1", "a2", "b2", "c2"];
  if (!document.getElementById("plotDosEcuaciones")) return;

  function val(id) {
    return parseFloat(document.getElementById(id).value) || 0;
  }
  function fmt(n) {
    return Number(n.toFixed(3)).toString();
  }

  function puntosDeRecta(a, b, c, radio) {
    if (a === 0 && b === 0) return null;
    let px, py;
    if (Math.abs(b) > 1e-9) {
      px = 0;
      py = c / b;
    } else {
      px = c / a;
      py = 0;
    }
    const dx = -b, dy = a;
    const norm = Math.hypot(dx, dy) || 1;
    const ux = dx / norm, uy = dy / norm;
    return {
      x: [px - radio * ux, px + radio * ux],
      y: [py - radio * uy, py + radio * uy],
    };
  }

  function dibujar() {
    const a1 = val("a1"), b1 = val("b1"), c1 = val("c1");
    const a2 = val("a2"), b2 = val("b2"), c2 = val("c2");

    const det = a1 * b2 - a2 * b1;
    const div = document.getElementById("plotDosEcuaciones");
    const resDiv = document.getElementById("resDosEcuaciones");

    const maxAbs = Math.max(4, Math.abs(c1), Math.abs(c2), Math.abs(a1), Math.abs(b1)) * 1.5;
    const traces = [];
    const l1 = puntosDeRecta(a1, b1, c1, maxAbs * 2);
    const l2 = puntosDeRecta(a2, b2, c2, maxAbs * 2);
    if (l1) traces.push({ x: l1.x, y: l1.y, mode: "lines", line: { color: "#1f77b4", width: 3 }, name: "recta 1" });
    if (l2) traces.push({ x: l2.x, y: l2.y, mode: "lines", line: { color: "#d62728", width: 3 }, name: "recta 2" });

    let mensaje, punto = null;
    if (Math.abs(det) > 1e-9) {
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;
      punto = [x, y];
      mensaje = `<b class="ok">Solución única</b>: rectas secantes, (x, y) = (${fmt(x)}, ${fmt(y)})`;
    } else {
      const k = Math.abs(a1) > 1e-9 ? a2 / a1 : (Math.abs(b1) > 1e-9 ? b2 / b1 : null);
      const coincidentes = k !== null
        ? Math.abs(c2 - k * c1) < 1e-6
        : Math.abs(c1) < 1e-9 && Math.abs(c2) < 1e-9;
      mensaje = coincidentes
        ? `<b class="ok">Infinitas soluciones</b>: las dos ecuaciones describen la misma recta.`
        : `<b class="warn">Sin solución</b>: rectas paralelas distintas (sistema inconsistente).`;
    }

    const layout = {
      margin: { t: 20, r: 20, b: 40, l: 40 },
      xaxis: { range: [-maxAbs, maxAbs], zeroline: true, title: "x" },
      yaxis: { range: [-maxAbs, maxAbs], zeroline: true, title: "y", scaleanchor: "x" },
      showlegend: false,
    };
    if (punto) {
      traces.push({
        x: [punto[0]], y: [punto[1]], mode: "markers+text", text: ["intersección"],
        textposition: "top center", marker: { size: 10, color: "#2ca02c" },
      });
    }
    Plotly.react(div, traces, layout, { displayModeBar: false, responsive: true });

    resDiv.innerHTML =
      `Recta 1: ${fmt(a1)}x + ${fmt(b1)}y = ${fmt(c1)} &nbsp;&nbsp;` +
      `Recta 2: ${fmt(a2)}x + ${fmt(b2)}y = ${fmt(c2)}<br>` +
      `Determinante a&#8321;b&#8322; &minus; a&#8322;b&#8321; = ${fmt(det)}<br>${mensaje}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    ids.forEach((id) => document.getElementById(id).addEventListener("input", dibujar));
    dibujar();
  });
})();
