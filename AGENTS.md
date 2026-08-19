# AGENTS.md — Guía para agentes de IA

> **Punto de entrada único.** Léelo completo y luego lee, en orden, los archivos de "Al inicio de
> cada sesión" antes de responder otra cosa. Define **cómo trabajar**; el *por qué* del proyecto
> está en `DESIGN.md`, el detalle de formatos en `PROTOCOL.md`.

## Regla crítica: no revertir trabajo ajeno

Un agente solo revierte cambios que él mismo hizo en la sesión actual. No revertir cambios
preexistentes, del usuario ni de otros agentes. Ante un archivo con cambios mezclados, revertir
solo los hunks propios; si no se puede identificar el origen con certeza, conservar y preguntar.

Con `persistencia = ninguna` no hay diff que permita identificar hunks: la regla se endurece a
**no tocar lo que no escribiste en esta sesión** y preguntar ante la duda.

## Descripción del proyecto

Material docente del curso de Álgebra Lineal para ingeniería (Universidad del Cauca, 2026), en 8
unidades — una por cada capítulo de Grossman (*Álgebra Lineal*, 7a/8a ed.) —, organizado en un
semestre de 16 semanas (4 horas/semana). Cada semana produce guía de aprendizaje, notas de clase,
diapositivas en LaTeX, y — cuando existe — una sección de visualización interactiva en
`visualizacion/`. `Documento.txt` es el temario fuente; `PLAN.md` es el backlog semana a semana.
El detalle de propósito, principios y decisiones grandes vive en `DESIGN.md`.

## Estructura del proyecto

El proyecto está organizado en 4 carpetas principales por área/asignatura:

- `Algebra/` — Material docente del curso de Álgebra Lineal:
  - `Documento.txt`: temario fuente (8 unidades Grossman).
  - `PLAN.md`: backlog de 16 semanas.
  - `semana-01/` … `semana-16/`: contenidos semanales en LaTeX (`guia.tex`, `notas.tex`, `diapositivas.tex` y PDFs).
  - `visualizacion/`: página HTML/JS/Plotly.js interactiva de la Unidad 1.
- `Programacion/` — Material docente, guías y ejercicios de la asignatura de Programación.
- `Vision_de_Maquina/` — Material docente y laboratorios de Visión por Computador y Procesamiento de Imágenes.
- `Enfasis/` — Contenidos docentes y proyectos del área de Énfasis / Electivas.

Ecosistema de software multimateria (en la raíz):
- `servidor/` — API NestJS + PostgreSQL (banco de preguntas, evaluaciones, JWT).
- `web/` — Aplicación frontend React + Vite + Zustand (vistas estudiante/docente).
- `movil/` — Aplicación móvil Expo / React Native.

## Al inicio de cada sesión (OBLIGATORIO)

<!-- GENERADO: lista de arranque = roles `startup: obligatorio` ordenados por `order`. -->

Leer en este orden antes de responder cualquier cosa:

1. `AGENTS.md` — este archivo.
2. `HISTORY/LATEST.md` — estado actual y próximo paso (snapshot corto).
3. `HISTORY/HANDOVER.md` — si su `Estado` no es `SIN_TRABAJO_ACTIVO`, respetar su alcance antes de editar.

**Bajo demanda** (grep dirigido, no leer completos): `DESIGN.md` (orientación inicial),
`PROTOCOL.md` (formatos/cierre), `HISTORY/INDEX.md` (historial).

## Regla dura: antes de un cambio interrumpible

`HISTORY/HANDOVER.md` debe quedar en `EN_PROGRESO` con objetivo, alcance y verificación prevista.
No depende del tamaño estimado del cambio. **Exención:** cambios que SOLO tocan el **contenido** de
la documentación. No exime una **migración estructural** (mover o renombrar docs: rituales CONFIG y
ACTUALIZAR), aunque no toque código: es justo lo que deja media instancia inconsistente si se corta.

## Al finalizar cada sesión (OBLIGATORIO)

Seguir el checklist de cierre de `PROTOCOL.md`. En resumen: crear `HISTORY/sesion-{NNN}-{YYYY-MM-DD}.md`;
append de una fila a `HISTORY/INDEX.md` con `printf >>`;
reescribir `HISTORY/LATEST.md` completo; llevar toda decisión durable a su hogar (mapa abajo),
nunca solo en el historial; refrescar `HISTORY/HANDOVER.md`
(→ `SIN_TRABAJO_ACTIVO` apuntando a la sesión que cierras ahora, o `EN_PROGRESO`);
**comprobar si toca auditar** (si pasaron más de 10 sesiones desde la última fila de `HISTORY/AUDIT.md`,
anotarlo en los pendientes de `HISTORY/LATEST.md`); y los archivos en disco son el registro.

## Dónde vive cada cosa (un hogar por dato)

<!-- GENERADO: tabla de enrutamiento derivada de los `triggers` de los roles activos. -->

| Necesito… | Hogar |
| --- | --- |
| cómo trabajar, proceso, convenciones, arranque | `AGENTS.md` |
| por qué: principios, decisiones grandes, restricciones, glosario | `DESIGN.md` |
| formatos/protocolo de documentación | `PROTOCOL.md` |
| dónde estamos / próximo paso | `HISTORY/LATEST.md` |
| trabajo a medias (checkpoint) | `HISTORY/HANDOVER.md` |
| qué pasó y cuándo | `HISTORY/INDEX.md` → `HISTORY/sesion-{NNN}-{YYYY-MM-DD}.md` |
| cuándo se auditó la documentación y qué se decidió | `HISTORY/AUDIT.md` |

**PROHIBIDO** guardar contenido del proyecto en memoria privada del agente (`.claude/` etc.):
todo va a los docs del proyecto, visibles para cualquier agente y humano.

**PROHIBIDO** escribir credenciales, tokens o claves en cualquier doc del marco. Si el proyecto
necesita acceso a un servicio, el doc nombra la herramienta y de dónde toma sus credenciales
(variable de entorno, gestor de credenciales), nunca el secreto.

## Convenciones

- Cada semana de clase vive en su propia carpeta `semana-NN/` (dos dígitos, p. ej. `semana-01`),
  con tres archivos fuente: `guia.tex`, `notas.tex`, `diapositivas.tex` (Beamer), más sus `.pdf`
  compilados. `guia1/` (guía maestra de curso) es la única excepción nombrada a este patrón.
- Los subtemas y su numeración siguen siempre `Documento.txt`; si el temario cambia, se actualiza
  primero ahí y luego se propagan los cambios a los materiales afectados.
- `PLAN.md` es la fuente de verdad de qué semana está `hecho` y cuál `pendiente`; se actualiza al
  cerrar cada semana nueva. `HISTORY/LATEST.md` apunta a `PLAN.md` para el detalle, no lo duplica.
- Compilar con `pdflatex` (dos pasadas si hay referencias cruzadas/índice/TOC) y verificar que no
  queden errores antes de dar por cerrado un material. Los subproductos de compilación (`.aux`,
  `.log`, `.out`, `.nav`, `.snm`, `.toc`) no se conservan: se limpian tras verificar el PDF.
- `visualizacion/` es HTML/CSS/JS puro, sin build ni dependencias instaladas (librerías por CDN,
  p. ej. Plotly.js); se abre con `index.html` directo o con un servidor estático simple. Todo
  cambio de UI se prueba en un navegador real (o headless) antes de darlo por terminado, no solo
  con `node --check`.
- Con `persistencia = ninguna`: los archivos en disco son el registro, sin red de recuperación.
  La disciplina de escritura al cerrar cada sesión es crítica.

## Arranque

Para retomar o extender el material: leer `Documento.txt` para el temario vigente, revisar
`PLAN.md` para saber qué semana sigue, y seguir el patrón de carpeta `semana-NN/` descrito en
Convenciones. Requiere una distribución LaTeX con `pdflatex` (paquetes `babel` con `spanish`,
`amsmath`, `amssymb`, `beamer`, `hyperref`).
