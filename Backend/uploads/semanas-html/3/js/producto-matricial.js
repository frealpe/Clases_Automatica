// Taller interactivo 2.2 — producto de matrices C = AB, con A de m x p y B de p x n (p
// compartido, asi que el producto siempre esta definido por construccion). Muestra la formula
// fila-por-columna de cada entrada c_ij ademas de la matriz resultado.
(function () {
  const selM = document.getElementById("dimM");
  const selP = document.getElementById("dimP");
  const selN = document.getElementById("dimN");
  const cont = document.getElementById("gridsProducto");
  const btn = document.getElementById("btnMultiplicar");
  const salida = document.getElementById("resultadoProducto");
  if (!selM || !selP || !selN || !cont || !btn || !salida) return;

  function fmt(n) {
    return Number(n.toFixed(4)).toString();
  }

  function gridHTML(nombre, filas, cols, signo) {
    let filasHTML = "";
    for (let i = 0; i < filas; i++) {
      let celdas = "";
      for (let j = 0; j < cols; j++) {
        const valor = signo * ((i + j) % 4) + (nombre === "A" ? 1 : 0);
        celdas += `<td><input type="number" id="p${nombre}_${i}_${j}" value="${valor}" step="1"></td>`;
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
    const m = parseInt(selM.value, 10);
    const p = parseInt(selP.value, 10);
    const n = parseInt(selN.value, 10);
    cont.innerHTML = `<div class="controles">${gridHTML("A", m, p, 1)}${gridHTML("B", p, n, -1)}</div>`;
  }

  function leerMatriz(nombre, filas, cols) {
    const M = [];
    for (let i = 0; i < filas; i++) {
      const fila = [];
      for (let j = 0; j < cols; j++) {
        const el = document.getElementById(`p${nombre}_${i}_${j}`);
        fila.push(parseFloat(el.value) || 0);
      }
      M.push(fila);
    }
    return M;
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
    const m = parseInt(selM.value, 10);
    const p = parseInt(selP.value, 10);
    const n = parseInt(selN.value, 10);

    const A = leerMatriz("A", m, p);
    const B = leerMatriz("B", p, n);

    const C = [];
    const formulas = [];
    for (let i = 0; i < m; i++) {
      const filaC = [];
      for (let j = 0; j < n; j++) {
        let suma = 0;
        const terminos = [];
        for (let k = 0; k < p; k++) {
          const a = A[i][k];
          const b = B[k][j];
          suma += a * b;
          terminos.push(`(${fmt(a)})(${fmt(b)})`);
        }
        filaC.push(suma);
        formulas.push(`c<sub>${i + 1}${j + 1}</sub> = ${terminos.join(" + ")} = <strong>${fmt(suma)}</strong>`);
      }
      C.push(filaC);
    }

    salida.innerHTML =
      matrizHTML(`C = AB (${m}×${n})`, C) +
      `<div class="recuadro ejemplo"><span class="titulo">Detalle fila por columna</span>${formulas.join("<br>")}</div>`;
  }

  selM.addEventListener("change", render);
  selP.addEventListener("change", render);
  selN.addEventListener("change", render);
  btn.addEventListener("click", calcular);
  render();
})();
