// Simulador visual del llenado de una matriz con ciclos for anidados. Construye una traza de
// pasos (uno por celda, en el orden de recorrido elegido) y la reproduce con un intervalo,
// resaltando en el panel de codigo la linea del ciclo externo (al iniciar cada fila/columna
// nueva) y la linea de asignacion (en cada paso), junto con los indices [fila][col] activos.
(function () {
  const app = document.getElementById("simulador-app");
  if (!app) return;

  const selTam = document.getElementById("sel-tam");
  const selModo = document.getElementById("sel-modo");
  const selOrden = document.getElementById("sel-orden");
  const rangoVel = document.getElementById("rango-velocidad");
  const etiquetaVel = document.getElementById("etiqueta-velocidad");
  const btnSimular = document.getElementById("btn-simular");
  const btnPaso = document.getElementById("btn-paso");
  const btnReiniciar = document.getElementById("btn-reiniciar");
  const grid = document.getElementById("matriz-grid");
  const vectorGrid = document.getElementById("vector-grid");
  const formulaIdx = document.getElementById("formula-idx");
  const panelCodigo = document.getElementById("panel-codigo");
  const estadoSim = document.getElementById("estado-sim");

  let trace = [];
  let pasoActual = 0;
  let sumaAcumulada = 0;
  let intervalId = null;
  let corriendo = false;
  let valoresAleatorios = null;

  function generarValor(modo, fila, col) {
    switch (modo) {
      case "producto":
        return (fila + 1) * (col + 1);
      case "suma":
        return fila + col;
      case "identidad":
        return fila === col ? 1 : 0;
      case "aleatorio":
        return valoresAleatorios[fila][col];
      default:
        return 0;
    }
  }

  function construirTrace(n, orden) {
    const t = [];
    if (orden === "filas") {
      for (let fila = 0; fila < n; fila++) {
        for (let col = 0; col < n; col++) {
          t.push({ fila, col, nuevoGrupo: col === 0 });
        }
      }
    } else {
      for (let col = 0; col < n; col++) {
        for (let fila = 0; fila < n; fila++) {
          t.push({ fila, col, nuevoGrupo: fila === 0 });
        }
      }
    }
    return t;
  }

  function lineasCodigo(modo, orden) {
    const asignacion = {
      producto: "matriz[fila][col] = (fila + 1) * (col + 1);",
      suma: "matriz[fila][col] = fila + col;",
      identidad: "matriz[fila][col] = (fila == col) ? 1 : 0;",
      aleatorio: "matriz[fila][col] = rand() % 90 + 10;",
    }[modo];

    if (orden === "filas") {
      return {
        lineas: [
          "for (int fila = 0; fila < N; fila++) {",
          "    for (int col = 0; col < N; col++) {",
          "        " + asignacion,
          "    }",
          "}",
        ],
        lineaExterna: 0,
        lineaAsignacion: 2,
      };
    }
    return {
      lineas: [
        "for (int col = 0; col < N; col++) {",
        "    for (int fila = 0; fila < N; fila++) {",
        "        " + asignacion,
        "    }",
        "}",
      ],
      lineaExterna: 0,
      lineaAsignacion: 2,
    };
  }

  function renderPanelCodigo(modo, orden) {
    const { lineas } = lineasCodigo(modo, orden);
    panelCodigo.innerHTML = lineas
      .map((l, i) => `<span class="linea" data-linea="${i}">${l.replace(/</g, "&lt;")}</span>`)
      .join("");
  }

  function marcarLinea(indice, activa) {
    const el = panelCodigo.querySelector(`[data-linea="${indice}"]`);
    if (!el) return;
    el.classList.toggle("linea-actual", activa);
  }

  function limpiarLineas() {
    panelCodigo.querySelectorAll(".linea").forEach((el) => el.classList.remove("linea-actual"));
  }

  function construirGrid(n) {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${n}, 2.6rem)`;
    for (let fila = 0; fila < n; fila++) {
      for (let col = 0; col < n; col++) {
        const celda = document.createElement("div");
        celda.className = "celda-matriz";
        celda.id = `celda-${fila}-${col}`;
        celda.textContent = "";
        grid.appendChild(celda);
      }
    }

    // Vector lineal: las mismas N*N celdas, pero en el orden real en que quedan una tras otra en
    // memoria (row-major, idx = fila*N + col) — sin importar el orden en que el ciclo las llene.
    vectorGrid.innerHTML = "";
    for (let fila = 0; fila < n; fila++) {
      for (let col = 0; col < n; col++) {
        const idx = fila * n + col;
        const celda = document.createElement("div");
        celda.className = "celda-vector";
        celda.id = `vec-${fila}-${col}`;
        celda.innerHTML = `<span class="idx-vector">${idx}</span><span class="valor-vector"></span>`;
        vectorGrid.appendChild(celda);
      }
    }
    if (formulaIdx) formulaIdx.textContent = `idx = fila·${n} + col`;
  }

  function detener() {
    corriendo = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    btnSimular.textContent = "▶ Simular";
  }

  function reiniciar() {
    detener();
    const n = parseInt(selTam.value, 10);
    const modo = selModo.value;
    const orden = selOrden.value;

    if (modo === "aleatorio") {
      valoresAleatorios = [];
      for (let f = 0; f < n; f++) {
        const fila = [];
        for (let c = 0; c < n; c++) fila.push(Math.floor(Math.random() * 90) + 10);
        valoresAleatorios.push(fila);
      }
    }

    trace = construirTrace(n, orden);
    pasoActual = 0;
    sumaAcumulada = 0;
    construirGrid(n);
    renderPanelCodigo(modo, orden);
    limpiarLineas();
    btnPaso.disabled = false;
    estadoSim.innerHTML = `Listo para simular una matriz de <b>${n}×${n}</b> (modo: <b>${etiquetaModo(modo)}</b>, orden: <b>${orden === "filas" ? "por filas" : "por columnas"}</b>). Pulsa "Simular" o avanza "Paso a paso".`;
  }

  function etiquetaModo(modo) {
    return (
      { producto: "producto de índices", suma: "suma de índices", identidad: "matriz identidad", aleatorio: "valores aleatorios" }[modo] || modo
    );
  }

  function paso() {
    if (pasoActual >= trace.length) return;

    if (pasoActual > 0) {
      const anterior = trace[pasoActual - 1];
      const celdaAnterior = document.getElementById(`celda-${anterior.fila}-${anterior.col}`);
      celdaAnterior.classList.remove("actual");
      celdaAnterior.classList.add("llena");
      const vecAnterior = document.getElementById(`vec-${anterior.fila}-${anterior.col}`);
      vecAnterior.classList.remove("actual");
      vecAnterior.classList.add("llena");
    }

    const { fila, col, nuevoGrupo } = trace[pasoActual];
    const modo = selModo.value;
    const orden = selOrden.value;
    const { lineaExterna, lineaAsignacion } = lineasCodigo(modo, orden);
    const valor = generarValor(modo, fila, col);
    sumaAcumulada += valor;

    marcarLinea(lineaExterna, nuevoGrupo);
    marcarLinea(lineaAsignacion, true);

    const celda = document.getElementById(`celda-${fila}-${col}`);
    celda.classList.add("actual");
    celda.textContent = valor;

    const n = parseInt(selTam.value, 10);
    const idxLineal = fila * n + col;
    const celdaVec = document.getElementById(`vec-${fila}-${col}`);
    celdaVec.classList.add("actual");
    celdaVec.querySelector(".valor-vector").textContent = valor;

    const varExterna = orden === "filas" ? "fila" : "col";
    const valExterna = orden === "filas" ? fila : col;

    pasoActual++;
    if (pasoActual >= trace.length) {
      celda.classList.remove("actual");
      celda.classList.add("llena");
      celdaVec.classList.remove("actual");
      celdaVec.classList.add("llena");
      btnPaso.disabled = true;
      limpiarLineas();
      estadoSim.innerHTML = `<b>Simulación completa.</b> Se llenaron las ${trace.length} celdas. Última asignación: <b>matriz[${fila}][${col}] = ${valor}</b> (vector[${idxLineal}]). Suma total de la matriz = <b>${sumaAcumulada}</b>.`;
    } else {
      estadoSim.innerHTML = `Paso <b>${pasoActual} / ${trace.length}</b> — ${nuevoGrupo ? `nueva iteración externa (${varExterna} = ${valExterna}), ` : ""}asignando <b>matriz[${fila}][${col}] = ${valor}</b> → <b>vector[${idxLineal}]</b>. Suma acumulada = <b>${sumaAcumulada}</b>.`;
    }
  }

  function alternarSimulacion() {
    if (corriendo) {
      detener();
      return;
    }
    if (pasoActual >= trace.length) {
      reiniciar();
    }
    corriendo = true;
    btnSimular.textContent = "⏸ Pausar";
    const velocidad = parseInt(rangoVel.value, 10);
    intervalId = setInterval(() => {
      paso();
      if (pasoActual >= trace.length) {
        detener();
      }
    }, velocidad);
  }

  selTam.addEventListener("change", reiniciar);
  selModo.addEventListener("change", reiniciar);
  selOrden.addEventListener("change", reiniciar);
  rangoVel.addEventListener("input", () => {
    etiquetaVel.textContent = `${rangoVel.value} ms/paso`;
    if (corriendo) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        paso();
        if (pasoActual >= trace.length) detener();
      }, parseInt(rangoVel.value, 10));
    }
  });
  btnSimular.addEventListener("click", alternarSimulacion);
  btnPaso.addEventListener("click", () => {
    if (corriendo) detener();
    paso();
  });
  btnReiniciar.addEventListener("click", reiniciar);

  etiquetaVel.textContent = `${rangoVel.value} ms/paso`;
  reiniciar();
})();
