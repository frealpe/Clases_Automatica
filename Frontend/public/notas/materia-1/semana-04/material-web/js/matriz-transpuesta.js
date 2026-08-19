document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("widget-matriz-transpuesta");
  if (!container) return;

  container.innerHTML = `
    <h3>Transpuesta $A^T$, Simetría y Descomposición $A = S + K$</h3>
    <p>Ingresa la dimensión $m \\times n$, los valores de la matriz $A$, y obtén $A^T$, la verificación de simetría/antisimetría, y su descomposición única $A = S + K$.</p>
    
    <div style="margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center;">
      <div>
        <label><b>Filas ($m$):</b> </label>
        <select id="sel-filas-trans" style="padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid var(--borde);">
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div>
        <label><b>Columnas ($n$):</b> </label>
        <select id="sel-cols-trans" style="padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid var(--borde);">
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </div>

    <div id="grid-matriz-trans" class="matrix-input-grid"></div>

    <div>
      <button id="btn-calcular-trans" class="btn-accion">Calcular Transpuesta y Analizar</button>
    </div>

    <div id="res-transpuesta" class="paso-detalle" style="display:none;"></div>
  `;

  const selFilas = document.getElementById("sel-filas-trans");
  const selCols = document.getElementById("sel-cols-trans");
  const gridContainer = document.getElementById("grid-matriz-trans");
  const btnCalcular = document.getElementById("btn-calcular-trans");
  const resContainer = document.getElementById("res-transpuesta");

  function renderGrid(rows, cols) {
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 55px)`;
    gridContainer.innerHTML = "";
    
    const defaults = [
      [2, 5, 1],
      [1, 4, 3],
      [0, 2, 6]
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const input = document.createElement("input");
        input.type = "number";
        input.step = "any";
        input.className = "matrix-cell";
        input.dataset.r = r;
        input.dataset.c = c;
        input.value = defaults[r][c];
        gridContainer.appendChild(input);
      }
    }
  }

  selFilas.addEventListener("change", () => {
    renderGrid(parseInt(selFilas.value), parseInt(selCols.value));
    resContainer.style.display = "none";
  });

  selCols.addEventListener("change", () => {
    renderGrid(parseInt(selFilas.value), parseInt(selCols.value));
    resContainer.style.display = "none";
  });

  renderGrid(2, 2);

  function formatNum(n) {
    if (Math.abs(n) < 1e-9) return "0";
    return Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, "");
  }

  btnCalcular.addEventListener("click", () => {
    const rows = parseInt(selFilas.value);
    const cols = parseInt(selCols.value);
    const inputs = gridContainer.querySelectorAll("input");
    
    let A = Array.from({ length: rows }, () => Array(cols).fill(0));
    inputs.forEach(inp => {
      const r = parseInt(inp.dataset.r);
      const c = parseInt(inp.dataset.c);
      A[r][c] = parseFloat(inp.value) || 0;
    });

    // Compute transpose A^T (cols x rows)
    let AT = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        AT[c][r] = A[r][c];
      }
    }

    resContainer.style.display = "block";
    let html = `<strong>Matriz Transpuesta $A^T$ (dimensión $${cols} \\times ${rows}$):</strong><br>`;
    html += `$$\\begin{pmatrix} `;
    for (let r = 0; r < cols; r++) {
      html += AT[r].map(formatNum).join(" & ");
      if (r < cols - 1) html += " \\\\ ";
    }
    html += ` \\end{pmatrix}$$<br>`;

    if (rows === cols) {
      // Check symmetry and antisymmetry
      let esSimetrica = true;
      let esAntisimetrica = true;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.abs(A[r][c] - AT[r][c]) > 1e-9) esSimetrica = false;
          if (Math.abs(A[r][c] + AT[r][c]) > 1e-9) esAntisimetrica = false;
        }
      }

      html += `<strong>Clasificación:</strong> `;
      if (esSimetrica) {
        html += `<span style="color: var(--ok); font-weight: bold;">$A$ es SIMÉTRICA ($A^T = A$)</span><br>`;
      } else if (esAntisimetrica) {
        html += `<span style="color: var(--warn); font-weight: bold;">$A$ es ANTISIMÉTRICA ($A^T = -A$)</span><br>`;
      } else {
        html += `<span>$A$ no es ni simétrica ni antisimétrica.</span><br>`;
      }

      // Compute S = (A + A^T)/2 and K = (A - A^T)/2
      let S = Array.from({ length: rows }, () => Array(cols).fill(0));
      let K = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          S[r][c] = (A[r][c] + AT[r][c]) / 2;
          K[r][c] = (A[r][c] - AT[r][c]) / 2;
        }
      }

      html += `<br><strong>Descomposición única $A = S + K$:</strong><br>`;
      html += `Parte Simétrica $S = \\frac{1}{2}(A + A^T)$:`;
      html += `$$\\begin{pmatrix} `;
      for (let r = 0; r < rows; r++) {
        html += S[r].map(formatNum).join(" & ");
        if (r < rows - 1) html += " \\\\ ";
      }
      html += ` \\end{pmatrix}$$`;

      html += `Parte Antisimétrica $K = \\frac{1}{2}(A - A^T)$:`;
      html += `$$\\begin{pmatrix} `;
      for (let r = 0; r < rows; r++) {
        html += K[r].map(formatNum).join(" & ");
        if (r < rows - 1) html += " \\\\ ";
      }
      html += ` \\end{pmatrix}$$`;

    } else {
      html += `<br><em>Nota: La matriz $A$ es rectangular ($m \\neq n$), por lo que no aplican los conceptos de simetría o descomposición $S+K$ (exclusivos de matrices cuadradas).</em>`;
    }

    resContainer.innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise([resContainer]);
  });
});
