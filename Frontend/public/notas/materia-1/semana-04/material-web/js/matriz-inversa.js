document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("widget-matriz-inversa");
  if (!container) return;

  container.innerHTML = `
    <h3>Calculadora e Intérprete del Algoritmo de Gauss-Jordan $[A \\mid I_n] \\to [I_n \\mid A^{-1}]$</h3>
    <p>Ingresa los valores de la matriz cuadrada $A$. El widget construirá la matriz aumentada con la <strong>matriz identidad $I_n$</strong> a la derecha, y mostrará el proceso paso a paso de reducción por filas hasta obtener $A^{-1}$.</p>
    
    <div style="margin-bottom: 1rem;">
      <label><b>Dimensiones ($n \\times n$):</b> </label>
      <select id="sel-tamano-inv" style="padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid var(--borde);">
        <option value="2">2 x 2</option>
        <option value="3">3 x 3</option>
      </select>
    </div>

    <div id="grid-matriz-inv" class="matrix-input-grid"></div>

    <div>
      <button id="btn-calcular-inv" class="btn-accion">Calcular $A^{-1}$ por Gauss-Jordan Paso a Paso</button>
    </div>

    <div id="res-inversa" class="paso-detalle" style="display:none;"></div>
  `;

  const selTamano = document.getElementById("sel-tamano-inv");
  const gridContainer = document.getElementById("grid-matriz-inv");
  const btnCalcular = document.getElementById("btn-calcular-inv");
  const resContainer = document.getElementById("res-inversa");

  function renderGrid(size) {
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 55px)`;
    gridContainer.innerHTML = "";
    
    const default2x2 = [[2, 5], [1, 3]];
    const default3x3 = [[1, 0, 2], [2, -1, 3], [4, 1, 8]];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const input = document.createElement("input");
        input.type = "number";
        input.step = "any";
        input.className = "matrix-cell";
        input.dataset.r = r;
        input.dataset.c = c;
        const val = (size === 2) ? default2x2[r][c] : default3x3[r][c];
        input.value = val;
        gridContainer.appendChild(input);
      }
    }
  }

  selTamano.addEventListener("change", (e) => {
    renderGrid(parseInt(e.target.value));
    resContainer.style.display = "none";
  });

  renderGrid(2);

  function formatNum(n) {
    if (Math.abs(n) < 1e-9) return "0";
    return Number.isInteger(n) ? n.toString() : n.toFixed(3).replace(/\.?0+$/, "");
  }

  function renderAugmentedMatrixLaTeX(matrix, size) {
    let latex = "\\left(\\begin{array}{" + "c".repeat(size) + "|" + "c".repeat(size) + "}\n";
    for (let r = 0; r < size; r++) {
      let rowLeft = matrix[r].slice(0, size).map(formatNum).join(" & ");
      let rowRight = matrix[r].slice(size).map(formatNum).join(" & ");
      latex += rowLeft + " & " + rowRight;
      if (r < size - 1) latex += " \\\\\n";
    }
    latex += "\n\\end{array}\\right)";
    return latex;
  }

  btnCalcular.addEventListener("click", () => {
    const size = parseInt(selTamano.value);
    const inputs = gridContainer.querySelectorAll("input");
    let A = Array.from({ length: size }, () => Array(size).fill(0));

    inputs.forEach(inp => {
      const r = parseInt(inp.dataset.r);
      const c = parseInt(inp.dataset.c);
      A[r][c] = parseFloat(inp.value) || 0;
    });

    resContainer.style.display = "block";
    let stepsHTML = "";

    // Step 0: Initial Augmented Matrix [A | I_n]
    let aug = Array.from({ length: size }, (_, r) => {
      let identityRow = Array(size).fill(0);
      identityRow[r] = 1;
      return [...A[r], ...identityRow];
    });

    stepsHTML += `<h4>Paso 0: Construcción de la Matriz Aumentada $[A \\mid I_${size}]$</h4>`;
    stepsHTML += `<p>Colocamos la matriz $A$ a la izquierda y la <strong>matriz identidad $I_${size}$</strong> a la derecha:</p>`;
    stepsHTML += `$$${renderAugmentedMatrixLaTeX(aug, size)}$$<br>`;

    // Step by step Gauss-Jordan
    let stepNum = 1;
    let isSingular = false;

    for (let col = 0; col < size; col++) {
      // Find pivot
      let maxRow = col;
      for (let r = col + 1; r < size; r++) {
        if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) {
          maxRow = r;
        }
      }

      if (Math.abs(aug[maxRow][col]) < 1e-9) {
        isSingular = true;
        break;
      }

      // Swap rows if necessary
      if (maxRow !== col) {
        let temp = aug[col];
        aug[col] = aug[maxRow];
        aug[maxRow] = temp;
        stepsHTML += `<h4>Paso ${stepNum++}: Intercambio de filas $R_${col+1} \\leftrightarrow R_${maxRow+1}$</h4>`;
        stepsHTML += `$$${renderAugmentedMatrixLaTeX(aug, size)}$$<br>`;
      }

      // Normalize pivot row to 1
      let pivot = aug[col][col];
      if (Math.abs(pivot - 1) > 1e-9) {
        for (let c = 0; c < 2 * size; c++) {
          aug[col][c] /= pivot;
        }
        stepsHTML += `<h4>Paso ${stepNum++}: Normalizar pivote en fila ${col+1} ($R_${col+1} \\leftarrow \\frac{1}{${formatNum(pivot)}} R_${col+1}$)</h4>`;
        stepsHTML += `$$${renderAugmentedMatrixLaTeX(aug, size)}$$<br>`;
      }

      // Eliminate column entries above and below
      for (let r = 0; r < size; r++) {
        if (r !== col && Math.abs(aug[r][col]) > 1e-9) {
          let factor = aug[r][col];
          for (let c = 0; c < 2 * size; c++) {
            aug[r][c] -= factor * aug[col][c];
          }
          stepsHTML += `<h4>Paso ${stepNum++}: Hacer cero en fila ${r+1}, col ${col+1} ($R_${r+1} \\leftarrow R_${r+1} - (${formatNum(factor)}) R_${col+1}$)</h4>`;
          stepsHTML += `$$${renderAugmentedMatrixLaTeX(aug, size)}$$<br>`;
        }
      }
    }

    if (isSingular) {
      stepsHTML += `<div style="background: #fee2e2; border-left: 4px solid var(--warn); padding: 1rem; border-radius: 4px;">`;
      stepsHTML += `<strong style="color: var(--warn);">Resultado: La matriz $A$ es SINGULAR ($\text{det}(A) = 0$).</strong><br>`;
      stepsHTML += `No es posible obtener la matriz identidad en el lado izquierdo. Por ende, <strong>NO existe matriz inversa $A^{-1}$</strong>.`;
      stepsHTML += `</div>`;
    } else {
      let inv = Array.from({ length: size }, (_, r) => aug[r].slice(size));
      
      stepsHTML += `<div style="background: #dcfce7; border-left: 4px solid var(--ok); padding: 1rem; border-radius: 4px;">`;
      stepsHTML += `<strong>¡Proceso de Gauss-Jordan Completado!</strong><br>`;
      stepsHTML += `La mitad izquierda se ha transformado en $I_${size}$. Por fundamentación de matrices elementales, la mitad derecha es exactamente la <strong>matriz inversa $A^{-1}$</strong>:<br>`;
      stepsHTML += `$$A^{-1} = \\begin{pmatrix} `;
      for (let r = 0; r < size; r++) {
        stepsHTML += inv[r].map(formatNum).join(" & ");
        if (r < size - 1) stepsHTML += " \\\\ ";
      }
      stepsHTML += ` \\end{pmatrix}$$`;
      stepsHTML += `</div>`;
    }

    resContainer.innerHTML = stepsHTML;
    if (window.MathJax) MathJax.typesetPromise([resContainer]);
  });
});
