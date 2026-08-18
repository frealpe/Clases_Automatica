/**
 * Base de Datos de las 16 semanas del curso de Álgebra Lineal 2026 (Universidad del Cauca)
 * Basado en Stanley I. Grossman (7a/8a ed.) y PLAN.md / Documento.txt
 */

export const SEMANAS_DATA = [
  {
    id: 1,
    numero: '01',
    unidad: 1,
    unidadNombre: 'Sistemas de ecuaciones lineales',
    capituloGrossman: 'Capítulo 1',
    subtemas: ['1.1. Introducción a los sistemas de ecuaciones lineales', '1.2. Dos ecuaciones lineales con dos incógnitas'],
    ra: 'RA1',
    raDescripcion: 'Resolver y clasificar sistemas de ecuaciones lineales mediante métodos analíticos y geométricos.',
    duracionExamenMin: 15,
    preguntas: [
      {
        id: 's01_p1',
        tipo: 'teoria',
        pregunta: '¿Cuál es la interpretación geométrica de un sistema de 2 ecuaciones lineales con 2 incógnitas que NO tiene solución (inconsistente)?',
        opciones: [
          { id: 'a', texto: 'Las dos rectas coinciden en todos sus puntos.' },
          { id: 'b', texto: 'Las dos rectas se intersecan en un único punto.' },
          { id: 'c', texto: 'Las dos rectas son paralelas y no se intersecan.' },
          { id: 'd', texto: 'Las rectas forman un ángulo recto entre sí.' }
        ],
        correcta: 'c',
        explicacion: 'Un sistema inconsistente no posee puntos en común, lo cual geométricamente representa dos rectas paralelas distintas en R².',
        falencia: 'Interpretación geométrica de sistemas de 2x2 e inconsistencia de rectas.'
      },
      {
        id: 's01_p2',
        tipo: 'ejercicio',
        pregunta: 'Dado el sistema de ecuaciones:\n  2x - 3y = 7\n  4x - 6y = 14\n¿Cómo se clasifica este sistema?',
        opciones: [
          { id: 'a', texto: 'Inconsistente (sin solución).' },
          { id: 'b', texto: 'Consistente determinado (solución única x=2, y=-1).' },
          { id: 'c', texto: 'Consistente indeterminado (infinitas soluciones).' },
          { id: 'd', texto: 'Sistema homogéneo trivial.' }
        ],
        correcta: 'c',
        explicacion: 'La segunda ecuación es exactamente el doble de la primera (4x - 6y = 2(2x - 3y) = 14), por lo que ambas corresponden a la misma recta y existen infinitas soluciones.',
        falencia: 'Identificación de sistemas dependientes e infinitas soluciones.'
      },
      {
        id: 's01_p3',
        tipo: 'ejercicio',
        pregunta: 'Encuentre el valor del determinante principal D del sistema:\n  3x + 2y = 8\n  x - 4y = -2',
        opciones: [
          { id: 'a', texto: 'D = -14' },
          { id: 'b', texto: 'D = 14' },
          { id: 'c', texto: 'D = -10' },
          { id: 'd', texto: 'D = 10' }
        ],
        correcta: 'a',
        explicacion: 'El determinante principal es |3  2; 1 -4| = (3)(-4) - (2)(1) = -12 - 2 = -14.',
        falencia: 'Cálculo de determinantes 2x2 en regla de Cramer.'
      },
      {
        id: 's01_p4',
        tipo: 'teoria',
        pregunta: 'Si un sistema lineal A x = b tiene matriz de coeficientes A cuadrada y det(A) ≠ 0, entonces:',
        opciones: [
          { id: 'a', texto: 'Tiene infinitas soluciones.' },
          { id: 'b', texto: 'Tiene una única solución.' },
          { id: 'c', texto: 'No tiene solución.' },
          { id: 'd', texto: 'Es un sistema homogéneo.' }
        ],
        correcta: 'b',
        explicacion: 'Por el Teorema del Resumen, si A es no singular (det(A) ≠ 0), el sistema A x = b tiene solución única dada por x = A⁻¹ b.',
        falencia: 'Teorema del resumen e inverting matrices cuadradas no singulares.'
      }
    ]
  },
  {
    id: 2,
    numero: '02',
    unidad: 1,
    unidadNombre: 'Sistemas de ecuaciones lineales',
    capituloGrossman: 'Capítulo 1',
    subtemas: ['1.3. m ecuaciones con n incógnitas: eliminación de Gauss-Jordan y gaussiana', '1.4. Sistemas homogéneos de ecuaciones'],
    ra: 'RA1',
    raDescripcion: 'Aplicar la eliminación de Gauss-Jordan y analizar la estructura de soluciones de sistemas homogéneos.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's02_p1',
        tipo: 'teoria',
        pregunta: '¿Cuál de las siguientes matrices está en Forma Escalonada Reducida por Renglones (FERR)?',
        opciones: [
          { id: 'a', texto: '[1 2 0; 0 1 3; 0 0 0]' },
          { id: 'b', texto: '[1 0 3; 0 1 -2; 0 0 0]' },
          { id: 'c', texto: '[0 1 0; 1 0 0; 0 0 1]' },
          { id: 'd', texto: '[2 0 0; 0 1 0; 0 0 1]' }
        ],
        correcta: 'b',
        explicacion: 'En FERR, el primer elemento no nulo de cada renglón es 1 (pivote) y en la columna de cada pivote todos los demás elementos son 0.',
        falencia: 'Criterios de Forma Escalonada Reducida por Renglones (FERR).'
      },
      {
        id: 's02_p2',
        tipo: 'teoria',
        pregunta: 'Todo sistema homogéneo de ecuaciones lineales A x = 0 es siempre:',
        opciones: [
          { id: 'a', texto: 'Inconsistente.' },
          { id: 'b', texto: 'Consistente, teniendo al menos la solución trivial x = 0.' },
          { id: 'c', texto: 'Indeterminado con infinitas soluciones necesariamente.' },
          { id: 'd', texto: 'Insoluble si m > n.' }
        ],
        correcta: 'b',
        explicacion: 'x = 0 siempre satisface A(0) = 0, por lo que nunca puede ser inconsistente.',
        falencia: 'Propiedades fundamentales de los sistemas homogéneos.'
      },
      {
        id: 's02_p3',
        tipo: 'ejercicio',
        pregunta: 'Un sistema homogéneo tiene 3 ecuaciones y 5 incógnitas. ¿Qué se puede afirmar sobre sus soluciones?',
        opciones: [
          { id: 'a', texto: 'Tiene solución única (la trivial).' },
          { id: 'b', texto: 'Tiene infinitas soluciones no triviales (existen variables libres).' },
          { id: 'c', texto: 'No tiene solución.' },
          { id: 'd', texto: 'El sistema es inconsistente.' }
        ],
        correcta: 'b',
        explicacion: 'Por el Teorema de sistemas homogéneos con más incógnitas que ecuaciones (n > m), el sistema posee infinitas soluciones.',
        falencia: 'Teorema de sistemas homogéneos con m < n.'
      },
      {
        id: 's02_p4',
        tipo: 'ejercicio',
        pregunta: 'Al aplicar Gauss-Jordan a un sistema 3x3 se obtiene la matriz aumentada [1 0 2 | 5; 0 1 -1 | 3; 0 0 0 | 0]. ¿Cuál es la solución general?',
        opciones: [
          { id: 'a', texto: 'x = 5 - 2z, y = 3 + z, con z libre.' },
          { id: 'b', texto: 'x = 5 + 2z, y = 3 - z, con z libre.' },
          { id: 'c', texto: 'x = 5, y = 3, z = 0.' },
          { id: 'd', texto: 'Sistema inconsistente.' }
        ],
        correcta: 'a',
        explicacion: 'De la fila 1: x + 2z = 5 => x = 5 - 2z. De la fila 2: y - z = 3 => y = 3 + z, con z parámetro libre.',
        falencia: 'Parametrización de soluciones infinitas a partir de FERR.'
      }
    ]
  },
  {
    id: 3,
    numero: '03',
    unidad: 2,
    unidadNombre: 'Vectores y matrices',
    capituloGrossman: 'Capítulo 2',
    subtemas: ['2.1. Vectores y matrices', '2.2. Productos vectorial y matricial'],
    ra: 'RA2',
    raDescripcion: 'Operar algebraicamente vectores y matrices comprendiendo la dimensión y condiciones de producto.',
    duracionExamenMin: 15,
    preguntas: [
      {
        id: 's03_p1',
        tipo: 'teoria',
        pregunta: 'Si A es una matriz de tamaño 3x4 y B es una matriz de tamaño 4x2, ¿cuál es la dimensión de la matriz producto C = A · B?',
        opciones: [
          { id: 'a', texto: '4x4' },
          { id: 'b', texto: '3x2' },
          { id: 'c', texto: '2x3' },
          { id: 'd', texto: 'El producto no está definido.' }
        ],
        correcta: 'b',
        explicacion: 'El producto A(m x n) · B(n x p) resulta en una matriz C de dimensión m x p. En este caso 3x4 por 4x2 da 3x2.',
        falencia: 'Compatibilidad de dimensiones en multiplicación matricial.'
      },
      {
        id: 's03_p2',
        tipo: 'ejercicio',
        pregunta: 'Sean u = (2, -1, 3) y v = (1, 4, -2). El producto escalar (producto punto) u · v es igual a:',
        opciones: [
          { id: 'a', texto: '-8' },
          { id: 'b', texto: '8' },
          { id: 'c', texto: '-4' },
          { id: 'd', texto: '12' }
        ],
        correcta: 'c',
        explicacion: 'u · v = (2)(1) + (-1)(4) + (3)(-2) = 2 - 4 - 6 = -4.',
        falencia: 'Cálculo del producto escalar entre vectores.'
      },
      {
        id: 's03_p3',
        tipo: 'teoria',
        pregunta: '¿Es la multiplicación de matrices conmutativa en general (es decir, A · B = B · A)?',
        opciones: [
          { id: 'a', texto: 'Sí, siempre para matrices cuadradas.' },
          { id: 'b', texto: 'No, en general A · B ≠ B · A.' },
          { id: 'c', texto: 'Sí, si ambas matrices son de la misma dimensión.' },
          { id: 'd', texto: 'Solo cuando las matrices son triangulares.' }
        ],
        correcta: 'b',
        explicacion: 'La multiplicación de matrices no es conmutativa en general.',
        falencia: 'Propiedades algebraicas de la multiplicación de matrices.'
      }
    ]
  },
  {
    id: 4,
    numero: '04',
    unidad: 2,
    unidadNombre: 'Vectores y matrices',
    capituloGrossman: 'Capítulo 2',
    subtemas: ['2.3. Matrices y sistemas de ecuaciones lineales', '2.4. Inversa de una matriz cuadrada', '2.5. Transpuesta de una matriz'],
    ra: 'RA2',
    raDescripcion: 'Calcular la inversa y transpuesta de una matriz y resolver sistemas representados matricialmente.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's04_p1',
        tipo: 'teoria',
        pregunta: 'Dada una matriz A invertible, la inversa de su transpuesta (A^T)⁻¹ es igual a:',
        opciones: [
          { id: 'a', texto: '(A⁻¹)^T' },
          { id: 'b', texto: 'A^T' },
          { id: 'c', texto: '-A⁻¹' },
          { id: 'd', texto: '1 / (A^T)' }
        ],
        correcta: 'a',
        explicacion: 'La propiedad fundamental establece que (A^T)⁻¹ = (A⁻¹)^T.',
        falencia: 'Propiedades de la transpuesta e inversa matricial.'
      },
      {
        id: 's04_p2',
        tipo: 'ejercicio',
        pregunta: 'Dada A = [2 1; 5 3], calcule su matriz inversa A⁻¹:',
        opciones: [
          { id: 'a', texto: '[3 -1; -5 2]' },
          { id: 'b', texto: '[-3 1; 5 -2]' },
          { id: 'c', texto: '[3 5; 1 2]' },
          { id: 'd', texto: '[1/2 1; 1/5 1/3]' }
        ],
        correcta: 'a',
        explicacion: 'Para A = [a b; c d] con det=ad-bc=6-5=1, A⁻¹ = (1/det)[d -b; -c a] = [3 -1; -5 2].',
        falencia: 'Fórmula y cálculo de la inversa de una matriz 2x2.'
      }
    ]
  },
  {
    id: 5,
    numero: '05',
    unidad: 2,
    unidadNombre: 'Vectores y matrices',
    capituloGrossman: 'Capítulo 2',
    subtemas: ['2.6. Matrices elementales y matrices inversas', '2.7. Factorización LU de una matriz'],
    ra: 'RA2',
    raDescripcion: 'Utilizar matrices elementales y factorización LU para resolución eficiente de sistemas.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's05_p1',
        tipo: 'teoria',
        pregunta: 'En la factorización LU de una matriz A = L · U (sin pivoteo), la matriz L es:',
        opciones: [
          { id: 'a', texto: 'Triangular superior con 1s en la diagonal.' },
          { id: 'b', texto: 'Triangular inferior con 1s en la diagonal.' },
          { id: 'c', texto: 'Una matriz diagonal pura.' },
          { id: 'd', texto: 'Una matriz ortogonal.' }
        ],
        correcta: 'b',
        explicacion: 'L (Lower) representa la matriz triangular inferior unitaria formada por los multiplicadores de la eliminación gaussiana.',
        falencia: 'Estructura y definición de la factorización LU.'
      }
    ]
  },
  {
    id: 6,
    numero: '06',
    unidad: 3,
    unidadNombre: 'Determinantes',
    capituloGrossman: 'Capítulo 3',
    subtemas: ['3.1. Definiciones básicas y propiedades de los determinantes', '3.2. Regla de Cramer', '3.3. Determinantes e inversas'],
    ra: 'RA3',
    raDescripcion: 'Evaluar determinantes mediante cofactores y propiedades, aplicando la regla de Cramer.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's06_p1',
        tipo: 'teoria',
        pregunta: 'Si se intercambian dos filas de una matriz cuadrada A de n x n para obtener B, ¿cuál es la relación entre det(B) y det(A)?',
        opciones: [
          { id: 'a', texto: 'det(B) = det(A)' },
          { id: 'b', texto: 'det(B) = -det(A)' },
          { id: 'c', texto: 'det(B) = 2 · det(A)' },
          { id: 'd', texto: 'det(B) = 0' }
        ],
        correcta: 'b',
        explicacion: 'Intercambiar dos filas o columnas de una matriz invierte el signo de su determinante.',
        falencia: 'Efecto de las operaciones elementales de fila sobre el determinante.'
      },
      {
        id: 's06_p2',
        tipo: 'ejercicio',
        pregunta: 'Si A es una matriz 3x3 con det(A) = 4, ¿cuánto vale det(2A)?',
        opciones: [
          { id: 'a', texto: '8' },
          { id: 'b', texto: '16' },
          { id: 'c', texto: '32' },
          { id: 'd', texto: '64' }
        ],
        correcta: 'c',
        explicacion: 'Por propiedad, det(k · A) = k^n · det(A). Para n=3 y k=2: det(2A) = 2³ · 4 = 8 · 4 = 32.',
        falencia: 'Propiedad de multiplicación por un escalar en determinantes de n x n.'
      }
    ]
  },
  {
    id: 7,
    numero: '07',
    unidad: 4,
    unidadNombre: 'Vectores en R2 y R3',
    capituloGrossman: 'Capítulo 4',
    subtemas: ['4.1. Vectores en el plano', '4.2. El producto escalar y las proyecciones en R2', '4.3. Vectores en el espacio'],
    ra: 'RA4',
    raDescripcion: 'Calcular proyecciones ortogonales y producto escalar geométrico en R² y R³.',
    duracionExamenMin: 15,
    preguntas: [
      {
        id: 's07_p1',
        tipo: 'ejercicio',
        pregunta: 'Dos vectores u y v satisfacen u · v = 0 con u ≠ 0 y v ≠ 0. ¿Qué ángulo forman entre sí?',
        opciones: [
          { id: 'a', texto: '0° (son paralelos).' },
          { id: 'b', texto: '45°.' },
          { id: 'c', texto: '90° (son ortogonales).' },
          { id: 'd', texto: '180°.' }
        ],
        correcta: 'c',
        explicacion: 'Dado u · v = ||u|| ||v|| cos(θ) = 0, cos(θ) = 0 implica θ = 90° (ortogonalidad).',
        falencia: 'Criterio de ortogonalidad mediante producto escalar.'
      }
    ]
  },
  {
    id: 8,
    numero: '08',
    unidad: 4,
    unidadNombre: 'Vectores en R2 y R3',
    capituloGrossman: 'Capítulo 4',
    subtemas: ['4.4. El producto cruz de dos vectores', '4.5. Rectas y planos en el espacio'],
    ra: 'RA4',
    raDescripcion: 'Determinar ecuaciones vectoriales de rectas y planos utilizando el producto cruz.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's08_p1',
        tipo: 'teoria',
        pregunta: 'El vector resultante del producto cruz u x v de dos vectores no paralelos en R³ es:',
        opciones: [
          { id: 'a', texto: 'Un escalar proporcional al área.' },
          { id: 'b', texto: 'Un vector coplanar a u y v.' },
          { id: 'c', texto: 'Un vector perpendicular tanto a u como a v.' },
          { id: 'd', texto: 'Un vector nulo siempre.' }
        ],
        correcta: 'c',
        explicacion: 'El producto cruz u x v es un vector ortogonal al plano determinado por u y v.',
        falencia: 'Propiedades del producto cruz en R³.'
      }
    ]
  },
  {
    id: 9,
    numero: '09',
    unidad: 5,
    unidadNombre: 'Espacios vectoriales',
    capituloGrossman: 'Capítulo 5',
    subtemas: ['5.1. Definición y propiedades básicas', '5.2. Subespacios vectoriales', '5.3. Combinación lineal y espacio generado'],
    ra: 'RA5',
    raDescripcion: 'Verificar los axiomas de espacio vectorial y criterios de subespacio y generadores.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's09_p1',
        tipo: 'teoria',
        pregunta: '¿Cuáles son las dos condiciones necesarias y suficientes para que un subconjunto no vacío H de un espacio vectorial V sea un subespacio?',
        opciones: [
          { id: 'a', texto: 'Ser finito y contener vectores positivos.' },
          { id: 'b', texto: 'Cerrado bajo la suma vectorial y cerrado bajo la multiplicación por escalar.' },
          { id: 'c', texto: 'Tener determinante no nulo y ser ortogonal.' },
          { id: 'd', texto: 'Contener únicamente al vector cero.' }
        ],
        correcta: 'b',
        explicacion: 'Un subconjunto H ⊆ V es subespacio si x,y ∈ H => x+y ∈ H y c ∈ R, x ∈ H => c x ∈ H (y el vector cero 0 ∈ H).',
        falencia: 'Criterio de subespacio vectorial.'
      }
    ]
  },
  {
    id: 10,
    numero: '10',
    unidad: 5,
    unidadNombre: 'Espacios vectoriales',
    capituloGrossman: 'Capítulo 5',
    subtemas: ['5.4. Independencia lineal', '5.5. Bases y dimensión'],
    ra: 'RA5',
    raDescripcion: 'Determinar la independencia lineal de conjuntos de vectores y hallar bases y dimensión.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's10_p1',
        tipo: 'teoria',
        pregunta: 'Un conjunto de n vectores {v₁, v₂, ..., vₙ} en un espacio vectorial V de dimensión n forma una base de V si y solo si:',
        opciones: [
          { id: 'a', texto: 'Son linealmente independientes o generan a V.' },
          { id: 'b', texto: 'Son mutuamente ortogonales únicamente.' },
          { id: 'c', texto: 'Tienen norma unitaria.' },
          { id: 'd', texto: 'Contienen al vector cero.' }
        ],
        correcta: 'a',
        explicacion: 'En dimensión n, cualquier conjunto de n vectores linealmente independientes es automáticamente generador y por tanto base.',
        falencia: 'Teoremas de bases en espacios de dimensión finita.'
      }
    ]
  },
  {
    id: 11,
    numero: '11',
    unidad: 5,
    unidadNombre: 'Espacios vectoriales',
    capituloGrossman: 'Capítulo 5',
    subtemas: ['5.6. Rango, nulidad, espacio renglón y espacio columna de una matriz', '5.7. Cambio de base'],
    ra: 'RA5',
    raDescripcion: 'Aplicar el Teorema de la Dimensión (Rango + Nulidad = n) y matrices de cambio de base.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's11_p1',
        tipo: 'ejercicio',
        pregunta: 'Dada una matriz A de tamaño 4x6 con rango v(A) = 4. ¿Cuál es la nulidad de A (dimensión del espacio nulo)?',
        opciones: [
          { id: 'a', texto: 'Nulidad = 0' },
          { id: 'b', texto: 'Nulidad = 2' },
          { id: 'c', texto: 'Nulidad = 4' },
          { id: 'd', texto: 'Nulidad = 6' }
        ],
        correcta: 'b',
        explicacion: 'Por el Teorema de la Dimensión: Rango(A) + Nulidad(A) = n (número de columnas). 4 + Nulidad = 6 => Nulidad = 2.',
        falencia: 'Teorema de la dimensión de una matriz (Rango + Nulidad).'
      }
    ]
  },
  {
    id: 12,
    numero: '12',
    unidad: 6,
    unidadNombre: 'Espacios con producto interno',
    capituloGrossman: 'Capítulo 6',
    subtemas: ['6.1. Bases ortonormales y proyecciones en Rn', '6.2. Aproximación por mínimos cuadrados', '6.3. Espacios con producto interno y proyecciones'],
    ra: 'RA6',
    raDescripcion: 'Construir bases ortonormales con Gram-Schmidt y resolver problemas de mínimos cuadrados.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's12_p1',
        tipo: 'teoria',
        pregunta: 'El proceso de Gram-Schmidt permite convertir una base cualquiera de un espacio vectorial en:',
        opciones: [
          { id: 'a', texto: 'Una base ortonormal.' },
          { id: 'b', texto: 'Una matriz diagonal.' },
          { id: 'c', texto: 'Un sistema inconsistente.' },
          { id: 'd', texto: 'Un espacio de dimensión menor.' }
        ],
        correcta: 'a',
        explicacion: 'Gram-Schmidt ortogonaliza y luego normaliza vectores para construir una base ortonormal.',
        falencia: 'Algoritmo y finalidad del proceso de Gram-Schmidt.'
      }
    ]
  },
  {
    id: 13,
    numero: '13',
    unidad: 7,
    unidadNombre: 'Transformaciones lineales',
    capituloGrossman: 'Capítulo 7',
    subtemas: ['7.1. Definición y ejemplos', '7.2. Propiedades de las transformaciones lineales: imagen y núcleo'],
    ra: 'RA7',
    raDescripcion: 'Identificar transformaciones lineales y calcular su núcleo (kernel) e imagen.',
    duracionExamenMin: 15,
    preguntas: [
      {
        id: 's13_p1',
        tipo: 'teoria',
        pregunta: 'El núcleo (kernel) Nu(T) de una transformación lineal T: V -> W es:',
        opciones: [
          { id: 'a', texto: 'El conjunto de todos los vectores v ∈ V tales que T(v) = 0.' },
          { id: 'b', texto: 'El conjunto de todos los vectores w ∈ W tales que T(v) = w.' },
          { id: 'c', texto: 'El determinante de la matriz asociada.' },
          { id: 'd', texto: 'El espacio vectorial W completo.' }
        ],
        correcta: 'a',
        explicacion: 'Por definición, Nu(T) = { v ∈ V | T(v) = 0_W } y es un subespacio del dominio V.',
        falencia: 'Definición del núcleo o kernel de una transformación lineal.'
      }
    ]
  },
  {
    id: 14,
    numero: '14',
    unidad: 7,
    unidadNombre: 'Transformaciones lineales',
    capituloGrossman: 'Capítulo 7',
    subtemas: ['7.3. Representación matricial de una transformación lineal', '7.4. Isomorfismos e isometrías'],
    ra: 'RA7',
    raDescripcion: 'Representar matricialmente transformaciones lineales e identificar isomorfismos.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's14_p1',
        tipo: 'teoria',
        pregunta: 'Una transformación lineal T: V -> W entre espacios de igual dimensión finita es un ISOMORFISMO si y solo si:',
        opciones: [
          { id: 'a', texto: 'Su núcleo consiste únicamente en el vector cero (Nu(T) = {0}).' },
          { id: 'b', texto: 'Su matriz es diagonal.' },
          { id: 'c', texto: 'No es inyectiva.' },
          { id: 'd', texto: 'Su imagen es cero.' }
        ],
        correcta: 'a',
        explicacion: 'Para dim(V)=dim(W), T es inyectiva (Nu(T)={0}) ssi T es sobreyectiva ssi T es biyectiva (isomorfismo).',
        falencia: 'Condiciones de isomorfismo e inyectividad en transformaciones lineales.'
      }
    ]
  },
  {
    id: 15,
    numero: '15',
    unidad: 8,
    unidadNombre: 'Valores y vectores característicos',
    capituloGrossman: 'Capítulo 8',
    subtemas: ['8.1. Eigenvalores y eigenvectores', '8.2. Matrices semejantes y diagonalización', '8.3. Matrices simétricas y diagonalización ortogonal'],
    ra: 'RA8',
    raDescripcion: 'Calcular eigenvalores y eigenvectores resolviendo det(A - λI) = 0 y diagonalizar matrices.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's15_p1',
        tipo: 'ejercicio',
        pregunta: 'Los eigenvalores de una matriz cuadrada A se encuentran resolviendo la ecuación característica:',
        opciones: [
          { id: 'a', texto: 'det(A - λI) = 0' },
          { id: 'b', texto: 'A · v = 0' },
          { id: 'c', texto: 'det(A) = λ' },
          { id: 'd', texto: 'A^T = λA' }
        ],
        correcta: 'a',
        explicacion: 'Av = λv => (A - λI)v = 0. Para tener vectores no nulos v ≠ 0, se requiere det(A - λI) = 0.',
        falencia: 'Construcción y resolución del polinomio característico det(A - λI) = 0.'
      }
    ]
  },
  {
    id: 16,
    numero: '16',
    unidad: 8,
    unidadNombre: 'Valores y vectores característicos',
    capituloGrossman: 'Capítulo 8',
    subtemas: ['8.4. Formas cuadráticas y secciones cónicas', '8.5. Forma canónica de Jordan', '8.6. Aplicaciones a EDOs y modelos de población'],
    ra: 'RA8',
    raDescripcion: 'Aplicar la diagonalización en formas cuadráticas, sistemas dinámicos y cierre del semestre.',
    duracionExamenMin: 20,
    preguntas: [
      {
        id: 's16_p1',
        tipo: 'teoria',
        pregunta: 'Una matriz real A de n x n es diagonalizable ortogonalmente (A = Q D Q^T con Q ortogonal) si y solo si A es:',
        opciones: [
          { id: 'a', texto: 'Una matriz simétrica (A = A^T).' },
          { id: 'b', texto: 'Una matriz antisimétrica.' },
          { id: 'c', texto: 'Una matriz triangular superior.' },
          { id: 'd', texto: 'Una matriz nilpotente.' }
        ],
        correcta: 'a',
        explicacion: 'Por el Teorema Espectral para matrices reales, una matriz es diagonalizable ortogonalmente ssi es simétrica.',
        falencia: 'Teorema Espectral y diagonalización ortogonal de matrices simétricas.'
      }
    ]
  }
];
