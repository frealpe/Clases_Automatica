# DESIGN.md — Decisiones y principios generales del proyecto

> **Por qué `Algebra_2026` es como es**, a gran escala. Estable, se lee para orientarse y rara vez
> cambia. Frontera: aquí van *principios y apuestas grandes transversales*; las *especificaciones y
> decisiones por tema* van en los temas correspondientes; el
> *proceso de documentación* en `PROTOCOL.md`. Tope objetivo ~200 líneas.

## Norte
Producir material docente completo y coherente (guía maestra de curso, guías/notas/diapositivas
semanales) para el curso completo de Álgebra Lineal para ingeniería (8 unidades = 8 capítulos de
Grossman, 16 semanas), fiel a `Documento.txt` y `PLAN.md`, y listo para usar en el aula sin
retrabajo adicional.

## Principios de diseño (no negociables)
- **El temario manda** — `Documento.txt` es la fuente única de verdad sobre qué subtemas existen
  y su numeración; los tres materiales de una unidad se derivan de él, nunca al revés.
- **Tres materiales, un origen** — guía, notas y diapositivas de una unidad cubren los mismos
  subtemas con la misma numeración y las mismas definiciones/resultados, en tres formatos
  distintos (guía pedagógica, desarrollo teórico, síntesis visual).
- **Resultados de aprendizaje explícitos** — cada guía enuncia resultados de aprendizaje
  verificables (qué podrá *hacer* el estudiante), no solo una lista de contenidos.
- **Compilable siempre** — ningún `.tex` se da por terminado sin compilar sin errores a PDF.
- **Un hogar por dato** — cada hecho vive en un solo documento; los demás apuntan.

## Restricciones y no-negociables
- Todo el contenido en español (`idioma = es`), con la ortografía y notación matemática estándar
  en castellano.
- LaTeX como formato fuente de los tres materiales (guía y notas: `article`; diapositivas:
  `beamer`), compilable con `pdflatex`.
- No hay plantilla institucional de Unicauca impuesta para la guía de aprendizaje (decisión
  2026-08-04, ver abajo); se usa una estructura estándar propia.

## Decisiones estructurales (ADR-lite)
> Decisiones grandes y transversales. Formato corto y fechado.

### 2026-08-04 — Estructura de carpeta por unidad, sin plantilla institucional
- **Contexto:** primera unidad de contenido (temario 1.1–1.4 de `Documento.txt`); había que
  decidir organización de archivos y si seguir un formato institucional de Unicauca para la guía.
- **Decisión:** una carpeta por unidad (p. ej. `guia/`) con `guia.tex`, `notas.tex`,
  `diapositivas.tex`; estructura de guía estándar (objetivos, resultados de aprendizaje,
  contenidos, metodología, actividades, evaluación, bibliografía) diseñada libremente, sin
  plantilla institucional (no había una disponible).
- **Alternativas descartadas:** una carpeta por material tipo (`guias/`, `notas/`,
  `diapositivas/`) — se descartó porque dispersa los tres materiales de una misma unidad.
- **Consecuencias / detalle:** ver `AGENTS.md` → Estructura del proyecto y Convenciones.

### 2026-08-04 — Temario de curso completo (Grossman, 8 capítulos) y estructura semanal
- **Contexto:** `Documento.txt` solo tenía una unidad propia (4 subtemas, sin capítulo Grossman
  correspondiente). El usuario pidió el temario completo de Grossman, una guía a nivel de curso,
  y pasar de guías por unidad a guías por semana (16 semanas × 4 horas, para cubrir todo el
  temario en un semestre), con framing para ingenieros. Una primera reconstrucción del temario
  "de memoria" tuvo 7 unidades y orden incorrecto; el usuario aportó el temario real (8 capítulos)
  de una consulta externa, que es la fuente usada desde entonces.
- **Decisión:** `Documento.txt` = 8 unidades, una por capítulo de Grossman. `PLAN.md` es el
  backlog único de las 16 semanas (unidad/subtemas/RA/estado). `guia1/guia.tex` es la guía
  maestra (RA1–RA8, tabla de 8 unidades, cronograma de 16 semanas). Cada semana vive en
  `semana-NN/` con `guia.tex`/`notas.tex`/`diapositivas.tex`.
- **Alternativas descartadas:** mantener 7 unidades pese al temario correcto — viola "el temario
  manda" (la fuente debe ser fiel al libro real, no a una aproximación de memoria).
- **Consecuencias / detalle:** ver `Documento.txt`, `PLAN.md`, `guia1/guia.tex`.

### 2026-08-04 — Eliminación de la Unidad 1 propia (no correspondía a Grossman)
- **Contexto:** la unidad original del proyecto (vectores en Rⁿ/Cⁿ, producto interno, rectas e
  hiperplanos, matrices — desarrollada en la sesión 1, antes de adoptar el temario de Grossman)
  no correspondía a ningún capítulo real del libro; el usuario pidió quitarla del temario.
- **Decisión:** `Documento.txt` queda con 8 unidades = 8 capítulos de Grossman (renumeradas 1–8,
  sin hueco). Se **borró** el contenido construido para esa unidad: `guia/` (guía/notas/
  diapositivas de unidad), el contenido de `semana-01/` (subtemas 1.1–1.2 de la unidad vieja), y
  la carpeta `visualizacion/` completa (sus 4 pestañas cubrían exactamente los subtemas de la
  unidad eliminada). Las 16 semanas se redistribuyeron entre las 8 unidades reales, dando 3
  semanas (no 2) a las dos unidades con más subtemas (Vectores y matrices; Espacios vectoriales).
- **Alternativas descartadas:** conservar el contenido como material aparte sin número de unidad
  — se descartó explícitamente por el usuario a favor de borrarlo, para no arrastrar material que
  no pertenece al temario oficial.
- **Consecuencias / detalle:** ver `Documento.txt`, `PLAN.md`, `guia1/guia.tex`. Una futura
  visualización interactiva, si se construye, debe hacerse para el temario actual (8 unidades),
  no reutilizando la eliminada.

### 2026-08-05 — Postgres real en `servidor/` con `pg.Pool` crudo, no TypeORM; JWT real
- **Contexto:** `servidor/` (API NestJS del sistema multimateria) tenía `schema.sql` con las
  tablas ya definidas, pero ningún controller las usaba: todo vivía en arrays en memoria que se
  perdían al reiniciar, y el banco de preguntas del test de estudiante solo tenía 2 preguntas (0
  para semana 2). Además `RolesGuard` estaba roto — nunca había `request.user` porque no existía
  ningún guard de JWT que lo llenara, así que los endpoints `@Roles('DOCENTE')` siempre
  devolvían 403 sin importar quién llamara.
- **Decisión:** conectar `servidor/` a Postgres real con `pg.Pool` crudo (`database.service.ts`)
  contra el SQL ya escrito en `schema.sql`, en vez de introducir TypeORM (que figura en
  `package.json` pero no se usa) — el esquema no fue diseñado como entidades ORM (PK de
  `preguntas` es `VARCHAR`, no serial) y mapearlo habría sido más trabajo que las consultas
  parametrizadas directas. Auth con JWT real (`@nestjs/jwt` + `passport-jwt`, ambos ya eran
  dependencias sin usar): login firma el token, `JwtAuthGuard` lo valida y llena `request.user`
  antes de que `RolesGuard` lo consulte.
- **Alternativas descartadas:** mapear el esquema a entidades TypeORM — se descartó por el
  desajuste de forma (PK de texto en `preguntas`) y porque hubiera exigido rehacer `schema.sql`
  sin necesidad real de las features de un ORM aquí (relaciones simples, consultas cortas).
- **Consecuencias / detalle:** ver `servidor/src/database/`, `servidor/src/auth/`. Si una futura
  sesión necesita relaciones más complejas o migraciones versionadas, ahí sí vale reconsiderar
  TypeORM — hoy no se justificaba.

### 2026-08-05 — `semanas` en Postgres es calendario/RA, no depende de que exista el LaTeX
- **Contexto:** hasta la Sesión 36, Postgres solo tenía Álgebra (materia 1, semanas 1-2); las otras
  3 materias y el resto de semanas de Álgebra solo existían como fallback hardcodeado en
  `useCourseStore.js`. Al poblar la DB real para las 4 materias (16/16/9/16 semanas), ninguna de
  esas semanas nuevas tiene todavía `guia.tex`/`notas.tex` escrito.
- **Decisión:** la tabla `semanas` almacena el calendario/RA de la materia (qué semana cubre qué
  unidad, con qué resultado de aprendizaje) independientemente de si el material LaTeX de esa semana
  ya se escribió. Es lo mismo que ya hacía `Algebra/PLAN.md` (fila `pendiente` con RA ya fijado) —
  la DB simplemente refleja esa misma fuente de verdad para consumo de la plataforma.
- **Alternativas descartadas:** poblar `semanas` solo a medida que se escribe el LaTeX de cada
  semana — se descartó porque entonces el sidebar/panel no podría mostrar el temario completo de una
  materia (p. ej. cuántas semanas tiene Visión de Máquina) hasta terminar de escribir todo el curso.
- **Consecuencias / detalle:** `preguntas` (el banco de conocimiento real) sí sigue el criterio
  estricto — solo se llenan preguntas para semanas con material verificado (hoy: Álgebra 1-2). No
  confundir "semana con calendario fijado" con "semana con banco de preguntas listo para examen".

### 2026-08-05 — Temario de Énfasis: Nios II sobre FPGA + Procesamiento Digital de Señales
- **Contexto:** una sesión anterior (36) había poblado el fallback de Énfasis con un temario
  inventado ("Instrumentación y Control", PID/SCADA) sin confirmarlo con el usuario.
- **Decisión:** el temario real de Énfasis es implementación del procesador Nios II sobre FPGA
  (arquitectura, GPIO, USART, SPI, ADC) y Procesamiento Digital de Señales sobre ese mismo hardware
  (fundamentos, filtrado FIR pasa-bajas/pasa-altas, FFT), con más peso en el bloque de
  filtrado/FFT (7 de 16 semanas) que en periféricos — confirmado explícitamente con el usuario tras
  una ronda de preguntas de desambiguación.
- **Alternativas descartadas:** "Estadística" (una de las lecturas posibles del mensaje inicial,
  descartada por el usuario a favor de Nios II/PDS) e "Instrumentación y Control" (el guess de la
  Sesión 36).
- **Consecuencias / detalle:** ver `Backend/src/database/schema.sql` (materia 4, semanas 401-416) y
  `Frontend/src/store/useCourseStore.js` (`PLANES_SEMANALES_MATERIAS[4]`). `Enfasis/semana-NN/`
  sigue sin contenido LaTeX — cuando se escriba, debe seguir esta distribución de 7 unidades.

(Repetir por decisión. Las que dejan de ser relevantes se podan; su rastro queda en el historial.)

## Glosario
- **Unidad** — un capítulo de Grossman (8 en total), numerado según `Documento.txt`; agrupa
  varios subtemas (1.1, 1.2, …) y abarca 1 a 3 semanas.
- **Semana** — sesión de clase de 4 horas (16 en el semestre); grano más fino que "unidad" — una
  unidad con muchos subtemas se reparte en 2–3 semanas. Se materializa en `semana-NN/` con guía,
  notas y diapositivas propias. No confundir con "sesión" de `HISTORY/` (esa es de agente, no de
  clase).
- **Guía (de aprendizaje)** — documento pedagógico semanal: objetivos, resultados de aprendizaje,
  contenidos, plan de la sesión, actividades, evaluación, bibliografía.
- **Guía maestra** — documento pedagógico a nivel de curso completo (`guia1/guia.tex`): objetivos
  y RA generales (RA1–RA8), tabla de las 8 unidades, cronograma de 16 semanas, metodología y
  evaluación de curso; no confundir con la guía de una semana específica.
- **Notas de clase** — desarrollo teórico completo de una semana: definiciones, propiedades,
  teoremas, ejemplos y ejercicios propuestos.
- **Resultado de aprendizaje (RA)** — enunciado verificable de lo que el estudiante podrá *hacer*;
  a nivel de curso es RA1–RA8 (uno por unidad); a nivel de semana puede subdividirse (p. ej.
  RA1.1, RA1.2). No confundir con "contenido" (qué se ve) ni "objetivo" (intención general).
- **`PLAN.md`** — backlog de las 16 semanas: qué semana cubre qué unidad/subtemas/RA, y su estado
  (`hecho`/`pendiente`). Es el punto de entrada para saber qué semana construir a continuación.

## Mapa de documentación
Dónde vive cada tipo de información: ver `AGENTS.md` → "Dónde vive cada cosa" (no duplicar aquí).
