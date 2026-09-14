// Calificación de intentos de examen en el servidor.
//
// El cliente NUNCA envía la nota: manda solo las opciones elegidas y el servidor las compara
// contra la columna `correcta` del banco de preguntas. Así un estudiante no puede falsear su
// calificación ni ve las respuestas correctas hasta después de entregar.

export interface PreguntaCalificable {
  id: string | number;
  correcta?: string | null;
  explicacion?: string | null;
  falencia?: string | null;
  tipo?: string | null;
  pregunta?: string | null;
}

export interface ItemRevision {
  preguntaId: string | number;
  seleccionada: string | null;
  correcta: string;
  esCorrecta: boolean;
  explicacion: string | null;
  falencia: string | null;
}

export interface ResultadoCalificacion {
  correctas: number;
  total: number;
  porcentaje: number;
  nota5: number;
  aprobado: boolean;
  revision: ItemRevision[];
}

// Umbral único de aprobación en todo el ecosistema (web, móvil y calificación manual del
// docente): 60 % de aciertos, equivalente a 3.0 / 5.0.
export const UMBRAL_APROBACION_PORCENTAJE = 60;

// Acepta las respuestas como { [preguntaId]: 'a' } (lo que mandan web y móvil) o como
// ['a', 'b', ...] (índice = posición de la pregunta en la lista pasada).
export function normalizarRespuestas(
  respuestas: any,
  preguntas: PreguntaCalificable[],
): Record<string, string> {
  const mapa: Record<string, string> = {};
  if (Array.isArray(respuestas)) {
    respuestas.forEach((valor, idx) => {
      const p = preguntas[idx];
      if (p && valor != null && valor !== '') mapa[String(p.id)] = String(valor);
    });
  } else if (respuestas && typeof respuestas === 'object') {
    for (const [k, v] of Object.entries(respuestas)) {
      if (v != null && v !== '') mapa[String(k)] = String(v);
    }
  }
  return mapa;
}

export function calificar(
  preguntas: PreguntaCalificable[],
  respuestas: any,
): ResultadoCalificacion {
  const seleccion = normalizarRespuestas(respuestas, preguntas);
  let correctas = 0;

  const revision: ItemRevision[] = preguntas.map((p) => {
    const sel = seleccion[String(p.id)] ?? null;
    const correcta = String(p.correcta ?? '').toLowerCase();
    const esCorrecta = sel != null && sel.toLowerCase() === correcta && correcta !== '';
    if (esCorrecta) correctas += 1;
    return {
      preguntaId: p.id,
      seleccionada: sel,
      correcta: String(p.correcta ?? ''),
      esCorrecta,
      explicacion: p.explicacion ?? null,
      falencia: p.falencia ?? null,
    };
  });

  const total = preguntas.length;
  const divisor = total || 1;
  const porcentaje = Math.round((correctas / divisor) * 100);
  const nota5 = Number(((correctas / divisor) * 5).toFixed(1));
  const aprobado = total > 0 && porcentaje >= UMBRAL_APROBACION_PORCENTAJE;

  return { correctas, total, porcentaje, nota5, aprobado, revision };
}
