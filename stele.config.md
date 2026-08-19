# stele.config — Configuración del marco

> Fuente única de la configuración de ESTE proyecto. La editas a mano o con el ritual `config`
> (`.stele/SKILL.md`). El **auto-arranque** y el **mapa de documentación** se GENERAN de aquí —
> no los edites por separado. Todo lo accionable va en **tablas**; la prosa solo explica.
>
> **Contrato de parseo:** los headers `##` son secciones canónicas y fijas, en este orden:
> `Meta` · `Rutas` · `Nombres` · `Features` · `Presupuestos` · `Wording de rituales`. Se
> referencian por posición, no por su texto. En cada tabla, col1 = clave, col2 = valor; columnas
> y filas extra se ignoran. `—` en un nombre = rol desactivado. Fila ausente = default del
> rol/feature (ver `.stele/core/roles.md`). Al aplicar un cambio,
> `config` reescribe la tabla afectada **completa** y regenera los derivados.

## Meta

| Parámetro | Valor |
| --- | --- |
| idioma | es |
| módulos | — |
| persistencia | ninguna |
| persistencia_cmd | — |
| kit_origen | `https://github.com/emezav/stele` |

> `persistencia = ninguna` — no hay VCS: los archivos en disco **son** el registro. Verifica
> que todo quedó escrito al cerrar cada sesión. Ver `.stele/SKILL.md` → CERRAR, paso 7.
>
> `kit_origen` = de dónde se vendorizó el kit. Lo lee el ritual ACTUALIZAR para traer la versión
> nueva; sin él, actualizar se bloquea.

## Rutas

> Tres rutas independientes, todas relativas a la raíz del proyecto y sin `/` final. `kit` es
> maquinaria **reemplazable**; `base` son tus docs, y nunca se tocan al actualizar.
> **Invariante duro: `base` nunca puede quedar dentro de `kit`.**

| Ruta | Valor | Qué es |
| --- | --- | --- |
| kit | .stele | El marco vendorizado (`SKILL.md`, `GUIDE.md`, `core/`, `modules/`). |
| base | . | Raíz de los docs instanciados. `.` = raíz del proyecto. |
| loader | CLAUDE.md | Loader de auto-arranque, siempre en la raíz. GENERADO. |

## Nombres (rol → archivo)

| Rol | Archivo | Origen |
| --- | --- | --- |
| entry | AGENTS.md | núcleo |
| charter | DESIGN.md | núcleo |
| protocol | PROTOCOL.md | núcleo |
| state | LATEST.md | núcleo |
| handover | HANDOVER.md | núcleo |
| index | INDEX.md | núcleo |
| history_dir | HISTORY/ | núcleo |
| session | sesion-{NNN}-{YYYY-MM-DD}.md | núcleo |
| audit | AUDIT.md | núcleo |

## Features (toggles)

| Feature | Valor |
| --- | --- |
| effort_log | off |
| effort_unit | — |
| session_greeting | on |
| audit_log | on |
| audit_every_n_sessions | 10 |

> `audit_every_n_sessions` **no dispara nada**: es el umbral con el que el cierre decide si anota
> "auditoría vencida" en los pendientes de `LATEST.md`. Auditar sigue siendo un acto explícito.
> `—` = sin recordatorio. Con `audit_log = off` el recordatorio no aplica.

## Presupuestos

| Doc (rol) | Máx. líneas |
| --- | --- |
| state | 100 |
| handover | 50 |

## Wording de rituales

| Ritual | Parámetro | Texto |
| --- | --- | --- |
| checkpoint | trigger | antes de un cambio interrumpible |
| abrir | saludo | 1-3 líneas: última sesión + estado handover + próximo paso |
