# PROTOCOL.md — Protocolo de documentación entre sesiones

> **Cómo** se documenta (formatos, convenciones de edición, topes de tamaño) para que ningún
> archivo de estado crezca sin límite y para minimizar tokens/roundtrips de cualquier agente.
> Los rituales condensados están en `.stele/SKILL.md`; el *por qué*, en `.stele/GUIDE.md`.
> Los nombres de archivo abajo son los del manifiesto (`stele.config.md`).

## Principios

1. Los archivos de **estado** no crecen: se **sobrescriben** (formato fijo + tope).
2. El **historial** vive en archivos por sesión y **no se reabre** (se referencia por link).
3. Los **apéndices de una línea** usan `printf '...' >> archivo`, no `Read`+`Edit`.
4. Ninguna sección de un doc fuente-de-verdad supera **~150-200 líneas**; si crece, se extrae.
5. Nada de esto vive en memoria privada del agente; todo en el proyecto.
6. **Un hogar por dato** (mapa en `.stele/SKILL.md` y en `AGENTS.md`).

## Rutas: comando contra enlace

Dos clases, y no se resuelven igual:

- **Ruta de comando** (`printf '...' >> …`, `grep`): siempre **desde la raíz del
  proyecto**, porque ahí opera el agente. Incluye `HISTORY/` delante del nombre del archivo.
- **Enlace Markdown clicable** (`[INDEX.md](./INDEX.md)`): relativo **al archivo que lo contiene**,
  que es como lo resuelve cualquier visor.

## Archivos y su rol

Ver `.stele/GUIDE.md` → "Roles y fronteras". Aquí solo los **formatos**.

### `HISTORY/LATEST.md` — formato fijo, se SOBREESCRIBE (~100 líneas)

```markdown
# Estado actual
> Última sesión: Sesión N (YYYY-MM-DD) — ver HISTORY/sesion-NNN-YYYY-MM-DD.md
> Índice completo: HISTORY/INDEX.md

## Dónde estamos
- (3-8 bullets del estado REAL, no histórico)
## Próximo paso inmediato
- (lo que haría la siguiente sesión; reemplaza, no acumula)
## Pendientes operativos
- Procesos en background / decisiones abiertas / trabajo sin persistir
## Referencias
- DESIGN.md §X — … / tema de referencia
```

Al cerrar: reescribir COMPLETO. Nunca `Edit` para prepend/rename de "anterior".
En *Pendientes operativos* no anotes lo que ya quedará escrito al terminar esta sesión.

### `HISTORY/INDEX.md` — tabla append-only

`| Sesión | Fecha | Resumen | Archivo |`. Al cerrar:
`printf '| N | YYYY-MM-DD | resumen | sesion-NNN-YYYY-MM-DD.md |\n' >> HISTORY/INDEX.md`.

### `HISTORY/AUDIT.md` — tabla append-only (OPCIONAL, feature `audit_log`)

`| Audit | Fecha | Sesiones | Alcance | Hallazgos | Desenlace |`. Una fila por auditoría (ritual
AUDITAR). **Lo crea la primera auditoría, no el bootstrap.** `Sesiones` es el rango cubierto y es lo
que acota el alcance de la siguiente. Los hallazgos no se copian aquí: el detalle vive en el
`HISTORY/sesion-NNN-YYYY-MM-DD.md` de la sesión que auditó.

### `HISTORY/sesion-{NNN}-{YYYY-MM-DD}.md` — uno por sesión

Detalle completo: qué se hizo, decisiones, archivos tocados, verificación, notas para retomar.
`NNN` con padding a 3 dígitos. No se reabre; se lee con grep.

### `HISTORY/HANDOVER.md` — checkpoint de trabajo en curso (~50 líneas)

Estados: `SIN_TRABAJO_ACTIVO` | `EN_PROGRESO` | `COMPLETADO`. **Regla dura:** antes de un
cambio interrumpible, `EN_PROGRESO` con objetivo/alcance/verificación. Al cerrar, siempre refrescar
el puntero a la sesión que se cierra AHORA. Plantilla en `.stele/core/templates/handover.md`.

## Acuerdos de auditoría

Lo que el ritual AUDITAR señaló y el usuario decidió **no** cambiar. Se registra aquí para no
rediscutirlo en cada auditoría, y **siempre con umbral** — eso es lo que lo hace una decisión y no un
aplazamiento. Sección **curada**: al cruzarse el umbral, el acuerdo se revisita y se reescribe o se borra.

| Fecha | Doc | Acuerdo | Umbral de revisión |
| --- | --- | --- | --- |

## Checklist de inicio / cierre

Condensados en `.stele/SKILL.md` (rituales ABRIR / CERRAR). Este archivo es la referencia de
formato cuando haya dudas.

## Operaciones de bajo coste (preferir)

- Apéndice de fila → `printf '...' >> archivo`.
- Archivo pequeño de formato fijo → un `Write`.
- Buscar en archivo grande → `grep -n` + lectura por rango.
- Volumen mecánico grande → delegar a un subagente.
