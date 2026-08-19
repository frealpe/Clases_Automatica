// Motor del cuestionario interactivo. Consume el arreglo global PREGUNTAS (definido en
// js/preguntas.js), con el MISMO formato que usa el backend real para el sorteo aleatorio de
// examen (GET /preguntas/semana/:id/examen): {id, semanaId, tipo, pregunta, opciones, correcta,
// explicacion, falencia}. Aquí el sorteo se hace en el navegador, sin backend, para autoestudio.
(function () {
  const app = document.getElementById("cuestionario-app");
  if (!app || typeof PREGUNTAS === "undefined") return;

  const selCantidad = document.getElementById("sel-cantidad");
  const selTipo = document.getElementById("sel-tipo");
  const btnSortear = document.getElementById("btn-sortear");
  const btnCalificar = document.getElementById("btn-calificar");
  const zonaPreguntas = document.getElementById("zona-preguntas");
  const zonaResumen = document.getElementById("zona-resumen");

  let preguntasActivas = [];

  function barajar(arr) {
    const copia = arr.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function sortear() {
    const tipo = selTipo.value;
    const cantidadSel = selCantidad.value;
    let banco = PREGUNTAS.filter((p) => tipo === "todas" || p.tipo === tipo);
    banco = barajar(banco);
    const n = cantidadSel === "todas" ? banco.length : Math.min(parseInt(cantidadSel, 10), banco.length);
    preguntasActivas = banco.slice(0, n);
    renderPreguntas();
    zonaResumen.innerHTML = "";
    btnCalificar.disabled = false;
    btnCalificar.style.display = "inline-block";
    zonaPreguntas.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderPreguntas() {
    zonaPreguntas.innerHTML = "";
    preguntasActivas.forEach((p, idx) => {
      const div = document.createElement("div");
      div.className = "cuestionario-pregunta";
      div.dataset.qid = p.id;

      const badge = p.tipo === "teoria"
        ? '<span class="badge-tipo badge-teoria">Teoría</span>'
        : '<span class="badge-tipo badge-ejercicio">Ejercicio</span>';

      const opcionesHtml = p.opciones.map((op) => `
        <li>
          <label>
            <input type="radio" name="preg-${idx}" value="${op.id}">
            <span><strong>${op.id})</strong> ${op.texto}</span>
          </label>
        </li>`).join("");

      div.innerHTML = `
        <div class="enunciado">${idx + 1}. ${p.pregunta}${badge}</div>
        <ul class="cuestionario-opciones">${opcionesHtml}</ul>
        <div class="resultado-pregunta"></div>
      `;
      zonaPreguntas.appendChild(div);
    });
  }

  function calificar() {
    let correctas = 0;
    let sinResponder = 0;

    preguntasActivas.forEach((p, idx) => {
      const div = zonaPreguntas.querySelector(`[data-qid="${p.id}"]`);
      const marcada = div.querySelector(`input[name="preg-${idx}"]:checked`);
      const resultadoDiv = div.querySelector(".resultado-pregunta");
      div.classList.add("calificada");

      div.querySelectorAll(`input[name="preg-${idx}"]`).forEach((input) => input.disabled = true);

      const labelCorrecta = div.querySelector(`input[value="${p.correcta}"]`)?.closest("label");
      if (labelCorrecta) labelCorrecta.classList.add("opcion-correcta");

      if (!marcada) {
        sinResponder++;
        resultadoDiv.innerHTML = `
          <p class="sin-responder">No respondiste esta pregunta.</p>
          <div class="explicacion-cuestionario">${p.explicacion}
            <span class="falencia">Tema: ${p.falencia}</span>
          </div>`;
        return;
      }

      const esCorrecta = marcada.value === p.correcta;
      if (esCorrecta) {
        correctas++;
      } else {
        marcada.closest("label").classList.add("opcion-incorrecta");
      }

      resultadoDiv.innerHTML = `
        <div class="explicacion-cuestionario">
          ${esCorrecta ? "<strong>¡Correcto!</strong>" : "<strong>Incorrecto.</strong>"} ${p.explicacion}
          <span class="falencia">Tema: ${p.falencia}</span>
        </div>`;
    });

    const total = preguntasActivas.length;
    const pct = total ? Math.round((correctas / total) * 100) : 0;
    const nivel = pct >= 70 ? "" : "bajo";
    zonaResumen.innerHTML = `
      <div class="resumen-cuestionario">
        Resultado: <span class="puntaje ${nivel}">${correctas} / ${total}</span> (${pct}%)
        ${sinResponder > 0 ? `<br><span class="sin-responder">${sinResponder} pregunta(s) sin responder.</span>` : ""}
      </div>`;
    btnCalificar.disabled = true;
    zonaResumen.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  btnSortear.addEventListener("click", sortear);
  btnCalificar.addEventListener("click", calificar);

  sortear();
})();
