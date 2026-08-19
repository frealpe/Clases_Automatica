// Taller interactivo 2.1 — suma, resta y multiplicacion por escalar de matrices A y B del mismo
// tamano (elegido por el usuario). Recalcula la rejilla de entradas al cambiar filas/columnas, y
// muestra A+B, A-B y cA como tablas al pulsar "Calcular".
(function () {
  const selFilas = document.getElementById("matFilas");
  const selCols = document.getElementById("matCols");
  const cont = document.getElementById("gridsMatrices");
  const btn = document.getElementById("btnCalcularMat");
  const salida = document.getElementById("resultadoMat");
  if (!selFilas || !selCols || !cont || !btn || !salida) return;

  function fmt(n) {
    return Number(n.toFixed(4)).toString();
  }

  function gridHTML(nombre, filas, cols, signo) {
    let filasHTML = "";
    for (let i = 0; i < filas; i++) {
      let celdas = "";
      for (let j = 0; j < cols; j++) {
        const valor = signo * (i * cols + j + 1);
        celdas += `<td><input type="number" id="m${nombre}_${i}_${j}" value="${valor}" step="1"></td>`;
      }
      filasHTML += `<tr>${celdas}</tr>`;
    }
    return `
      <fieldset>
        <legend>Matriz ${nombre} (${filas}×${cols})</legend>
        <table class="datos">${filasHTML}</table>
      </fieldset>`;
  }

  function render() {
    const filas = parseInt(selFilas.value, 10);
    const cols = parseInt(selCols.value, 10);
    cont.innerHTML = `<div class="controles">${gridHTML("A", filas, cols, 1)}${gridHTML("B", filas, cols, -1)}</div>`;
  }

  function leerMatriz(nombre, filas, cols) {
    const M = [];
    for (let i = 0; i < filas; i++) {
      const fila = [];
      for (let j = 0; j < cols; j++) {
        const el = document.getElementById(`m${nombre}_${i}_${j}`);
        fila.push(parseFloat(el.value) || 0);
      }
      M.push(fila);
    }
    return M;
  }

  function combinar(A, B, op) {
    return A.map((fila, i) => fila.map((v, j) => op(v, B[i][j])));
  }

  function porEscalar(A, c) {
    return A.map((fila) => fila.map((v) => c * v));
  }

  function matrizHTML(etiqueta, M) {
    const filasHTML = M.map(
      (fila) => "<tr>" + fila.map((v) => `<td>${fmt(v)}</td>`).join("") + "</tr>"
    ).join("");
    return `
      <div class="resultado">
        <strong>${etiqueta}</strong>
        <table class="datos">${filasHTML}</table>
      </div>`;
  }

  function calcular() {
    const filas = parseInt(selFilas.value, 10);
    const cols = parseInt(selCols.value, 10);
    const c = parseFloat(document.getElementById("matEscalar").value) || 0;

    const A = leerMatriz("A", filas, cols);
    const B = leerMatriz("B", filas, cols);

    const suma = combinar(A, B, (a, b) => a + b);
    const resta = combinar(A, B, (a, b) => a - b);
    const cA = porEscalar(A, c);

    salida.innerHTML =
      matrizHTML("A + B", suma) + matrizHTML("A − B", resta) + matrizHTML(`${fmt(c)} · A`, cA);
  }

  selFilas.addEventListener("change", render);
  selCols.addEventListener("change", render);
  btn.addEventListener("click", calcular);
  render();
})();
