<!-- STELE:INICIO — bloque GENERADO. No editar a mano: se reescribe entero en `config` y al
     actualizar. Lo que esté FUERA de estas marcas es del proyecto y el marco no lo toca. -->

Este proyecto usa el marco **stele** (`.stele/`). El agente carga este archivo al iniciar cada
sesión, así que el ritual de apertura se ejecuta **automáticamente**: el contexto mínimo viene
importado abajo. No hace falta pedir "lee AGENTS.md".

**Reglas de sesión (resumen — detalle en `.stele/SKILL.md`):**

- **En tu PRIMERA respuesta de la sesión, empieza con 1-3 líneas de orientación** que confirmen el
  arranque: última sesión (N + título), si quedó trabajo a medias (`HISTORY/HANDOVER.md`), y próximo paso
  propuesto — sea cual sea el primer mensaje del usuario. (No puedes emitir un mensaje antes de que
  el usuario escriba; por eso el saludo va AL FRENTE de tu primera respuesta. Es la señal visible de
  que la stele se activó.)
- **Al usuario se le habla en llano, y se nombra el archivo entre paréntesis** — vale para el saludo,
  los informes y los resúmenes, no para lo que escribes en los docs. Tabla de equivalencias en
  `.stele/SKILL.md` → "Cómo se le habla al usuario". Hablar claro nunca es suavizar el hecho.
- **El habla va en el idioma del proyecto, con su ortografía natural** (en español, con acentos). Una
  regla de "solo ASCII" gobierna lo que se escribe a un archivo, no la prosa que lees tú.
- Si `HISTORY/HANDOVER.md` (abajo) está en `EN_PROGRESO`, respeta su alcance antes de editar.
- **antes de un cambio interrumpible**, deja `HISTORY/HANDOVER.md` en `EN_PROGRESO` con objetivo + alcance (regla
  dura; exención: editar el **contenido** de un doc — mover o renombrar docs **no** exime).
- **Al cerrar**, sigue el checklist de cierre de `PROTOCOL.md` (sesión-NNN, `HISTORY/INDEX.md`,
  reescribir `HISTORY/LATEST.md`, decisiones a su hogar, refrescar `HISTORY/HANDOVER.md`, y el **aviso de auditoría** si
  toca). Con `persistencia = ninguna`: los archivos en disco son el registro; verifica que todo quedó escrito.
- **Un hogar por dato:** consulta el *mapa de documentación* en `AGENTS.md` (se genera del manifiesto).
- Lee lo demás **bajo demanda con `grep`**; no abras archivos grandes completos.

---

## Contexto de arranque (auto-importado — GENERADO desde la lista de arranque)

<!-- Lista de arranque: roles `startup: obligatorio` ordenados por `order`.
     base = .  →  history_dir = HISTORY/ -->

@AGENTS.md
@HISTORY/LATEST.md
@HISTORY/HANDOVER.md

<!-- STELE:FIN -->
