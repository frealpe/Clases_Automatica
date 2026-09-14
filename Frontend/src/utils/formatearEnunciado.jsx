// Detecta fragmentos de código C dentro del enunciado de una pregunta y los devuelve como
// bloques <pre class="codigo"><code>...</code></pre> multilínea en vez de texto plano de una
// sola línea. Puerto a React de la misma heurística usada en
// Programacion/semana-01/material-web/js/cuestionario.js (formatearEnunciado/compactoAMultilinea),
// que es el formato con el que se cargó el banco de preguntas real en Backend/src/database/schema.sql.
// Soporta dos convenciones presentes en la BD:
//   (A) Código compacto con doble espacio como separador de sentencias.
//   (B) Código con \n ya incluido en la cadena.

const RE_C = /[;{}]|printf|scanf|\bint\b|\bfloat\b|\bchar\b|\bdouble\b|\blong\b|\bfor\b|\bwhile\b|\bif\b|\breturn\b|\bstatic\b|\bvoid\b|#include/;

const PRE_CLASS = 'my-2 rounded-md bg-slate-950 text-slate-100 text-[0.78rem] leading-relaxed p-3 overflow-x-auto font-mono whitespace-pre';

// Variante clara para contextos pensados para imprimirse en papel (evita gastar tinta de fondo oscuro).
export const PRE_CLASS_IMPRESION = 'my-2 rounded-md bg-slate-100 text-slate-900 border border-slate-300 text-[0.78rem] leading-relaxed p-3 overflow-x-auto font-mono whitespace-pre';

function compactoAMultilinea(codigo) {
  let nivel = 0;
  const lineas = [];
  let buf = '';
  let enCadena = false;
  let charAnterior = '';

  for (let i = 0; i < codigo.length; i++) {
    const c = codigo[i];
    const siguiente = codigo[i + 1] || '';

    if (c === '"' && charAnterior !== '\\') {
      enCadena = !enCadena;
      buf += c;
      charAnterior = c;
      continue;
    }
    if (enCadena) {
      buf += c;
      charAnterior = c;
      continue;
    }

    if (c === ' ' && siguiente === ' ') {
      const trimmed = buf.trim();
      if (trimmed) lineas.push('  '.repeat(nivel) + trimmed);
      buf = '';
      i++;
      charAnterior = ' ';
      continue;
    }

    if (c === '{') {
      const trimmed = buf.trim();
      lineas.push(trimmed ? '  '.repeat(nivel) + trimmed + ' {' : '  '.repeat(nivel) + '{');
      buf = '';
      nivel++;
      charAnterior = c;
      continue;
    }

    if (c === '}') {
      const trimmed = buf.trim();
      if (trimmed) lineas.push('  '.repeat(nivel) + trimmed);
      nivel = Math.max(0, nivel - 1);
      lineas.push('  '.repeat(nivel) + '}');
      buf = '';
      charAnterior = c;
      continue;
    }

    if (c === ';') {
      buf += ';';
      const trimmed = buf.trim();
      if (trimmed) lineas.push('  '.repeat(nivel) + trimmed);
      buf = '';
      charAnterior = c;
      continue;
    }

    buf += c;
    charAnterior = c;
  }

  const trimmed = buf.trim();
  if (trimmed) lineas.push('  '.repeat(nivel) + trimmed);

  return lineas.join('\n');
}

// Devuelve JSX: texto plano envuelto en <span>, código en <pre class="codigo"><code>.
export function formatearEnunciado(texto, preClassName = PRE_CLASS) {
  if (texto === null || texto === undefined) return null;

  if (!texto.includes('\n')) {
    if (!texto.includes('  ') || !RE_C.test(texto)) {
      return <span>{texto}</span>;
    }

    const partes = texto.split(/ {2,}/);
    const clasificadas = partes.map((p) => ({ texto: p, esCodigo: RE_C.test(p) }));

    const grupos = [];
    let grupoActual = { tipo: clasificadas[0].esCodigo ? 'codigo' : 'texto', partes: [clasificadas[0].texto] };
    for (let i = 1; i < clasificadas.length; i++) {
      const tipo = clasificadas[i].esCodigo ? 'codigo' : 'texto';
      if (tipo === grupoActual.tipo) {
        grupoActual.partes.push(clasificadas[i].texto);
      } else {
        grupos.push(grupoActual);
        grupoActual = { tipo, partes: [clasificadas[i].texto] };
      }
    }
    grupos.push(grupoActual);

    return grupos.map((g, i) => g.tipo === 'texto'
      ? <span key={i}>{g.partes.join(' ')}</span>
      : <pre key={i} className={preClassName}><code>{compactoAMultilinea(g.partes.join('  '))}</code></pre>
    );
  }

  const lineas = texto.split('\n');
  const grupos = [];
  let grupoActual = null;

  for (const linea of lineas) {
    const trimmed = linea.trim();
    const esCodigo = trimmed.length > 0 && RE_C.test(trimmed);

    if (!grupoActual) {
      grupoActual = { tipo: esCodigo ? 'codigo' : 'texto', lineas: [linea] };
    } else {
      const tipoActual = esCodigo ? 'codigo' : 'texto';
      if (trimmed === '') {
        grupoActual.lineas.push(linea);
      } else if (tipoActual === grupoActual.tipo) {
        grupoActual.lineas.push(linea);
      } else {
        grupos.push(grupoActual);
        grupoActual = { tipo: tipoActual, lineas: [linea] };
      }
    }
  }
  if (grupoActual) grupos.push(grupoActual);

  return grupos.map((g, i) => {
    const contenido = g.lineas.join('\n').trim();
    if (!contenido) return null;
    return g.tipo === 'texto'
      ? <span key={i}>{contenido}</span>
      : <pre key={i} className={preClassName}><code>{contenido}</code></pre>;
  }).filter(Boolean);
}

export default formatearEnunciado;
