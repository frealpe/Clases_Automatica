import React from 'react';

// Constante para diferenciar código C auténtico de enunciados con formato o expresiones matemáticas.
const RE_C_CODE = /#include|printf|scanf|\bint\s+\w+|\bfloat\s+\w+|\bchar\s+\w+|\bdouble\s+\w+|\bvoid\s+\w+|\bstruct\s+\w+|\bfor\s*\(|\bwhile\s*\(|\bif\s*\(|\breturn\b|\bmain\s*\(/;

const PRE_CLASS = 'my-2 rounded-md bg-slate-950 text-slate-100 text-[0.78rem] leading-relaxed p-3 overflow-x-auto font-mono whitespace-pre';

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

// Componente para renderizar matrices matemáticas de forma elegante (soporta matrices aumentadas A|b y notación LaTeX)
export function MatrizVisual({ contenido, esImpresion = false }) {
  if (!contenido) return null;

  let raw = contenido.trim();
  let esLatex = false;

  if (raw.includes('\\begin{')) {
    esLatex = true;
    raw = raw.replace(/\\begin\{(?:bmatrix|pmatrix|matrix|vmatrix|array)\}/, '')
             .replace(/\\end\{(?:bmatrix|pmatrix|matrix|vmatrix|array)\}/, '')
             .trim();
  } else {
    raw = raw.replace(/^\[/, '').replace(/\]$/, '').trim();
  }

  const separadorFilas = esLatex ? /\\\\|\n/ : /;|\n/;
  const filasRaw = raw.split(separadorFilas).map(f => f.trim()).filter(Boolean);

  if (filasRaw.length === 0) return <span>{contenido}</span>;

  const filasParseadas = filasRaw.map(fila => {
    if (esLatex) {
      const cels = fila.split('&').map(c => c.trim().replace(/\\vert/, '|')).filter(c => c !== '');
      const idxBarra = cels.indexOf('|');
      if (idxBarra !== -1) {
        const izq = cels.slice(0, idxBarra);
        const der = cels.slice(idxBarra + 1);
        return { izq, der };
      }
      return { izq: cels, der: [] };
    } else {
      if (fila.includes('|')) {
        const [izqStr, derStr] = fila.split('|');
        const izq = izqStr.trim().split(/[\s,]+/).filter(Boolean);
        const der = derStr ? derStr.trim().split(/[\s,]+/).filter(Boolean) : [];
        return { izq, der };
      } else {
        const izq = fila.trim().split(/[\s,]+/).filter(Boolean);
        return { izq, der: [] };
      }
    }
  });

  const tieneAugmented = filasParseadas.some(f => f.der && f.der.length > 0);

  return (
    <span className={`inline-flex items-center align-middle mx-1 my-1 px-1.5 py-1 rounded-lg border font-mono text-[0.83rem] shadow-sm select-none transition-all ${
      esImpresion
        ? 'bg-slate-50 border-slate-300 text-slate-900'
        : 'bg-slate-900/90 border-slate-700/80 text-sky-200'
    }`}>
      {/* Corchete Izquierdo Visual */}
      <span className={`w-1.5 self-stretch border-l-2 border-t-2 border-b-2 rounded-l ${
        esImpresion ? 'border-slate-800' : 'border-sky-400/80'
      }`} />

      {/* Grid de Filas y Columnas */}
      <span className="flex flex-col gap-1 px-2 py-0.5">
        {filasParseadas.map((f, rIdx) => (
          <span key={rIdx} className="flex items-center gap-3">
            {/* Columna Izquierda (Coeficientes) */}
            <span className={`flex items-center gap-3 ${tieneAugmented ? 'border-r-2 border-dashed pr-2.5 ' + (esImpresion ? 'border-slate-400' : 'border-sky-500/50') : ''}`}>
              {f.izq.map((val, cIdx) => (
                <span key={cIdx} className={`min-w-[1.2rem] text-center font-bold font-mono tracking-tight ${
                  esImpresion ? 'text-slate-900' : 'text-sky-300'
                }`}>
                  {val}
                </span>
              ))}
            </span>

            {/* Columna Derecha (Términos Independientes, si hay |) */}
            {tieneAugmented && (
              <span className="flex items-center gap-3 pl-0.5">
                {f.der.map((val, cIdx) => (
                  <span key={cIdx} className={`min-w-[1.2rem] text-center font-extrabold font-mono ${
                    esImpresion ? 'text-slate-950' : 'text-amber-300'
                  }`}>
                    {val}
                  </span>
                ))}
              </span>
            )}
          </span>
        ))}
      </span>

      {/* Corchete Derecho Visual */}
      <span className={`w-1.5 self-stretch border-r-2 border-t-2 border-b-2 rounded-r ${
        esImpresion ? 'border-slate-800' : 'border-sky-400/80'
      }`} />
    </span>
  );
}

// Formateador de ecuaciones matemáticas estilo LaTeX (fracciones apiladas, superíndices, subíndices, variables en cursiva)
export function EcuacionMath({ expresion, esImpresion = false }) {
  if (!expresion) return null;

  let texto = expresion.trim();
  // Limpiar delimitadores $ ... $ o \( ... \)
  if (texto.startsWith('$') && texto.endsWith('$')) {
    texto = texto.slice(1, -1).trim();
  } else if (texto.startsWith('\\(') && texto.endsWith('\\)')) {
    texto = texto.slice(2, -2).trim();
  }

  // Tokenizar expresiones y notación de transpuesta / fracciones
  const renderFragmentoMatematico = (fragmento, keyPrefix = '') => {
    const tokens = fragmento.split(/(\b[A-Za-z](?:\^|\_)(?:[A-Za-z0-9\-]+|\{[^}]+\})|[A-Za-z]²|\b[A-Za-z]\b|\=|\+|\-|\*|\/|\(|\)|\\neq|\\le|\\ge|\\times|≠|≤|≥)/g);

    return tokens.map((token, tIdx) => {
      if (!token) return null;
      const key = `${keyPrefix}-${tIdx}`;

      // Reemplazar A^T, A^\top, K^T, A^-1, A^2, I_n, k_ii
      if (/^[A-Za-z](\^|\_)/.test(token) || /^[A-Za-z]²$/.test(token)) {
        if (token.includes('^')) {
          const [base, expRaw] = token.split('^');
          const exp = expRaw.replace(/^\{/, '').replace(/\}$/, '').replace(/\\top/, 'T');
          return (
            <span key={key} className="inline-flex items-baseline font-serif italic font-bold">
              <span className={esImpresion ? 'text-slate-900' : 'text-sky-300'}>{base}</span>
              <sup className={`text-[0.72em] font-sans not-italic font-extrabold ml-0.5 ${esImpresion ? 'text-slate-950' : 'text-amber-300'}`}>{exp}</sup>
            </span>
          );
        } else if (token.includes('_')) {
          const [base, subRaw] = token.split('_');
          const sub = subRaw.replace(/^\{/, '').replace(/\}$/, '');
          return (
            <span key={key} className="inline-flex items-baseline font-serif italic font-bold">
              <span className={esImpresion ? 'text-slate-900' : 'text-sky-300'}>{base}</span>
              <sub className={`text-[0.72em] font-sans not-italic font-bold ${esImpresion ? 'text-slate-800' : 'text-sky-400'}`}>{sub}</sub>
            </span>
          );
        } else if (token.endsWith('²')) {
          const base = token[0];
          return (
            <span key={key} className="inline-flex items-baseline font-serif italic font-bold">
              <span className={esImpresion ? 'text-slate-900' : 'text-sky-300'}>{base}</span>
              <sup className={`text-[0.72em] font-sans not-italic font-extrabold ml-0.5 ${esImpresion ? 'text-slate-950' : 'text-amber-300'}`}>2</sup>
            </span>
          );
        }
      }

      // Variables únicas A, B, K, S, x, b, I
      if (/^[A-Za-z]$/.test(token)) {
        return (
          <span key={key} className={`font-serif italic font-bold mx-0.5 ${esImpresion ? 'text-slate-900' : 'text-sky-300'}`}>
            {token}
          </span>
        );
      }

      // Símbolos especiales LaTeX
      if (token === '\\neq' || token === '≠') return <span key={key} className="mx-1 font-bold">≠</span>;
      if (token === '\\le' || token === '\\leq' || token === '≤') return <span key={key} className="mx-1 font-bold">≤</span>;
      if (token === '\\ge' || token === '\\geq' || token === '≥') return <span key={key} className="mx-1 font-bold">≥</span>;
      if (token === '\\times' || token === '×') return <span key={key} className="mx-1">×</span>;

      return <span key={key}>{token}</span>;
    });
  };

  // Detectar y renderizar fracciones apiladas \frac{a}{b} o (1/2)
  const renderFraccion = (num, den, fKey) => (
    <span key={fKey} className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-sans text-[0.8em] font-bold leading-none ${
      esImpresion ? 'text-slate-950' : 'text-amber-300'
    }`}>
      <span className="border-b border-current px-1 pb-0.5">{num}</span>
      <span className="px-1 pt-0.5">{den}</span>
    </span>
  );

  const elementos = [];
  let ultimoIdx = 0;
  const reFracCombined = /(\\frac\{([^}]+)\}\{([^}]+)\}|\(([-+]?\d+|\w+)\/([-+]?\d+|\w+)\))/g;
  let matchFrac;

  while ((matchFrac = reFracCombined.exec(texto)) !== null) {
    if (matchFrac.index > ultimoIdx) {
      elementos.push(renderFragmentoMatematico(texto.substring(ultimoIdx, matchFrac.index), `txt-${ultimoIdx}`));
    }
    const num = matchFrac[2] || matchFrac[4];
    const den = matchFrac[3] || matchFrac[5];
    elementos.push(renderFraccion(num, den, `frac-${matchFrac.index}`));
    ultimoIdx = reFracCombined.lastIndex;
  }

  if (ultimoIdx < texto.length) {
    elementos.push(renderFragmentoMatematico(texto.substring(ultimoIdx), `txt-${ultimoIdx}`));
  }

  return (
    <span className={`inline-flex items-center align-middle mx-1 px-1.5 py-0.5 rounded border font-mono text-[0.88rem] shadow-xs select-none transition-all ${
      esImpresion ? 'bg-slate-100/80 border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700/80 text-slate-100'
    }`}>
      {elementos}
    </span>
  );
}

// Analiza fragmentos de texto y reemplaza matrices o ecuaciones matemáticas con componentes visuales
function renderizarTextoConMatricesYEcuaciones(texto, esImpresion = false) {
  if (!texto) return null;

  // Regex combinada para matrices [ ... ] con ; o | O notación LaTeX \begin{...}...\end{...} O ecuaciones con S = (1/2)(A+A^T), A^T, \frac, $, etc.
  const RE_EXPRESION_COMBINADA = /(\\begin\{(?:bmatrix|pmatrix|matrix|vmatrix|array)\}[\s\S]*?\\end\{(?:bmatrix|pmatrix|matrix|vmatrix|array)\}|\[\s*[^\]\n]*?(?:;|\|)[^\]\n]*?\]|\$(?:[^$]+)\$|\\(?:[^)]+)\\|[A-Z]\s*=\s*(?:\([^)]+\)|\\frac\{[^}]+\}\{[^}]+\}|\d+\/\d+)\s*\([^)]+\)|[A-Za-z](?:\^|\_)(?:[A-Za-z0-9\-]+|\{[^}]+\})|[A-Za-z]²)/g;

  const partes = [];
  let ultimoIndice = 0;
  let match;

  while ((match = RE_EXPRESION_COMBINADA.exec(texto)) !== null) {
    if (match.index > ultimoIndice) {
      partes.push(<span key={ultimoIndice}>{texto.substring(ultimoIndice, match.index)}</span>);
    }
    const tokenStr = match[0];
    if (tokenStr.startsWith('[') || tokenStr.includes('\\begin{')) {
      partes.push(<MatrizVisual key={match.index} contenido={tokenStr} esImpresion={esImpresion} />);
    } else {
      partes.push(<EcuacionMath key={match.index} expresion={tokenStr} esImpresion={esImpresion} />);
    }
    ultimoIndice = RE_EXPRESION_COMBINADA.lastIndex;
  }

  if (ultimoIndice < texto.length) {
    partes.push(<span key={ultimoIndice}>{texto.substring(ultimoIndice)}</span>);
  }

  return partes.length > 0 ? partes : <span>{texto}</span>;
}

// Devuelve JSX: texto plano con matrices y ecuaciones LaTeX formateadas, o bloque <pre class="codigo"><code> si es código C.
export function formatearEnunciado(texto, preClassName = PRE_CLASS) {
  if (texto === null || texto === undefined) return null;

  const esImpresion = preClassName === PRE_CLASS_IMPRESION;

  // Si contiene código C explícito (#include, printf, int main, etc.)
  if (RE_C_CODE.test(texto)) {
    if (!texto.includes('\n')) {
      const partes = texto.split(/ {2,}/);
      const clasificadas = partes.map((p) => ({ texto: p, esCodigo: RE_C_CODE.test(p) }));
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
        ? <span key={i}>{renderizarTextoConMatricesYEcuaciones(g.partes.join(' '), esImpresion)}</span>
        : <pre key={i} className={preClassName}><code>{compactoAMultilinea(g.partes.join('  '))}</code></pre>
      );
    }

    const lineas = texto.split('\n');
    const grupos = [];
    let grupoActual = null;

    for (const linea of lineas) {
      const trimmed = linea.trim();
      const esCodigo = trimmed.length > 0 && RE_C_CODE.test(trimmed);

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
        ? <span key={i}>{renderizarTextoConMatricesYEcuaciones(contenido, esImpresion)}</span>
        : <pre key={i} className={preClassName}><code>{contenido}</code></pre>;
    }).filter(Boolean);
  }

  // Texto estándar o enunciado de matemáticas: parsear matrices y ecuaciones
  return renderizarTextoConMatricesYEcuaciones(texto, esImpresion);
}

export default formatearEnunciado;
