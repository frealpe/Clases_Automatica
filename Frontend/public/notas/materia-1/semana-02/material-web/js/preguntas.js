const PREGUNTAS = [
  {
    "id": "s02_p1",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "¿Cuál de las siguientes matrices está en Forma Escalonada Reducida por Renglones (FERR / RREF)?",
    "opciones": [
      {
        "id": "a",
        "texto": "[1 2 0; 0 1 3; 0 0 0]"
      },
      {
        "id": "b",
        "texto": "[1 0 3; 0 1 -2; 0 0 0]"
      },
      {
        "id": "c",
        "texto": "[0 1 0; 1 0 0; 0 0 1]"
      },
      {
        "id": "d",
        "texto": "[2 0 0; 0 1 0; 0 0 1]"
      }
    ],
    "correcta": "b",
    "explicacion": "En FERR, el primer elemento no nulo de cada renglón es 1 (pivote), cada pivote está a la derecha del anterior, y en la columna de cada pivote todos los demás elementos son 0. La opción (a) falla porque la columna del segundo pivote tiene un 2 en la fila 1.",
    "falencia": "Criterios de Forma Escalonada Reducida por Renglones (FERR)."
  },
  {
    "id": "s02_p2",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Todo sistema homogéneo de ecuaciones lineales A x = 0 es siempre:",
    "opciones": [
      {
        "id": "a",
        "texto": "Inconsistente."
      },
      {
        "id": "b",
        "texto": "Consistente, teniendo al menos la solución trivial x = 0."
      },
      {
        "id": "c",
        "texto": "Indeterminado con infinitas soluciones necesariamente."
      },
      {
        "id": "d",
        "texto": "Insoluble si m > n."
      }
    ],
    "correcta": "b",
    "explicacion": "x=0 siempre satisface A·0=0 (cada ecuación queda 0=0), por lo que un sistema homogéneo nunca puede ser inconsistente.",
    "falencia": "Propiedad de la solución trivial en sistemas homogéneos."
  },
  {
    "id": "s02_p3",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Un sistema homogéneo tiene 3 ecuaciones y 5 incógnitas (m=3 < n=5). ¿Qué se puede afirmar sobre sus soluciones?",
    "opciones": [
      {
        "id": "a",
        "texto": "Tiene solución única (la trivial)."
      },
      {
        "id": "b",
        "texto": "Tiene infinitas soluciones no triviales (existen variables libres)."
      },
      {
        "id": "c",
        "texto": "No tiene solución."
      },
      {
        "id": "d",
        "texto": "El sistema es inconsistente."
      }
    ],
    "correcta": "b",
    "explicacion": "Por el teorema de sistemas homogéneos con más incógnitas que ecuaciones (m<n), el rango r ≤ m < n, así que siempre hay al menos n-r variables libres y por tanto soluciones no triviales.",
    "falencia": "Teorema de sistemas homogéneos con m < n (soluciones no triviales garantizadas)."
  },
  {
    "id": "s02_p4",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al aplicar Gauss-Jordan a un sistema 3x3 se obtiene la matriz aumentada [1 0 2 | 5; 0 1 -1 | 3; 0 0 0 | 0]. ¿Cuál es la solución general?",
    "opciones": [
      {
        "id": "a",
        "texto": "x = 5 - 2z, y = 3 + z, con z libre."
      },
      {
        "id": "b",
        "texto": "x = 5 + 2z, y = 3 - z, con z libre."
      },
      {
        "id": "c",
        "texto": "x = 5, y = 3, z = 0."
      },
      {
        "id": "d",
        "texto": "Sistema inconsistente."
      }
    ],
    "correcta": "a",
    "explicacion": "De la fila 1: x + 2z = 5 => x = 5 - 2z. De la fila 2: y - z = 3 => y = 3 + z, con z como variable libre (fila 3 es 0=0, no hay contradicción).",
    "falencia": "Parametrización de soluciones infinitas a partir de la forma escalonada reducida."
  },
  {
    "id": "s02_p5",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "¿Cuál de las siguientes NO es una operación elemental de fila válida en la eliminación de Gauss-Jordan?",
    "opciones": [
      {
        "id": "a",
        "texto": "Intercambiar dos filas."
      },
      {
        "id": "b",
        "texto": "Multiplicar una fila por un escalar distinto de cero."
      },
      {
        "id": "c",
        "texto": "Sumar a una fila un múltiplo escalar de otra fila."
      },
      {
        "id": "d",
        "texto": "Elevar al cuadrado todos los elementos de una fila."
      }
    ],
    "correcta": "d",
    "explicacion": "Las únicas tres operaciones elementales válidas son intercambiar filas, escalar una fila por una constante no nula, y sumar a una fila un múltiplo de otra. Elevar al cuadrado no es una operación elemental: no preserva el conjunto solución.",
    "falencia": "Identificación de las operaciones elementales de fila válidas."
  },
  {
    "id": "s02_p6",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Si se multiplica una fila de la matriz aumentada por 0, ¿qué ocurre?",
    "opciones": [
      {
        "id": "a",
        "texto": "Se obtiene un sistema equivalente al original."
      },
      {
        "id": "b",
        "texto": "Se pierde información: la operación NO es válida porque el escalar debe ser distinto de cero."
      },
      {
        "id": "c",
        "texto": "El sistema se vuelve homogéneo."
      },
      {
        "id": "d",
        "texto": "No cambia nada."
      }
    ],
    "correcta": "b",
    "explicacion": "La operación elemental de escalar una fila exige un escalar c≠0; multiplicar por 0 destruye la ecuación (la reemplaza por 0=0) y NO preserva el conjunto solución, así que no es una operación elemental válida.",
    "falencia": "Condición c≠0 en la operación elemental de escalar una fila."
  },
  {
    "id": "s02_p7",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Dos sistemas de ecuaciones lineales son equivalentes si:",
    "opciones": [
      {
        "id": "a",
        "texto": "Tienen el mismo número de ecuaciones."
      },
      {
        "id": "b",
        "texto": "Tienen exactamente el mismo conjunto de soluciones, aunque sus ecuaciones sean distintas."
      },
      {
        "id": "c",
        "texto": "Tienen la misma matriz de coeficientes."
      },
      {
        "id": "d",
        "texto": "Ambos son homogéneos."
      }
    ],
    "correcta": "b",
    "explicacion": "La equivalencia entre sistemas se define por el conjunto solución, no por la forma de las ecuaciones: dos sistemas pueden verse muy distintos y ser equivalentes si toda solución de uno es solución del otro.",
    "falencia": "Definición de sistemas equivalentes."
  },
  {
    "id": "s02_p8",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Sobre la matriz aumentada  [1 2 | 5; 3 1 | 4]  se aplica la operación F2 <- F2 - 3F1. ¿Cuál es la nueva fila 2?",
    "opciones": [
      {
        "id": "a",
        "texto": "[0  -5 | -11]"
      },
      {
        "id": "b",
        "texto": "[3  1 | 4]"
      },
      {
        "id": "c",
        "texto": "[0  -5 | 4]"
      },
      {
        "id": "d",
        "texto": "[3  -5 | -11]"
      }
    ],
    "correcta": "a",
    "explicacion": "F2 - 3F1 = [3-3(1), 1-3(2) | 4-3(5)] = [0, 1-6 | 4-15] = [0, -5 | -11].",
    "falencia": "Aplicar una operación elemental de fila (combinación lineal de filas) sobre la matriz aumentada."
  },
  {
    "id": "s02_p9",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Una fila de la forma  [0 0 0 | 5]  en la matriz aumentada escalonada indica que el sistema es:",
    "opciones": [
      {
        "id": "a",
        "texto": "Consistente determinado."
      },
      {
        "id": "b",
        "texto": "Consistente indeterminado."
      },
      {
        "id": "c",
        "texto": "Inconsistente."
      },
      {
        "id": "d",
        "texto": "Homogéneo."
      }
    ],
    "correcta": "c",
    "explicacion": "La fila [0 0 0 | 5] representa la ecuación 0=5, una contradicción: el sistema no tiene ninguna solución, es inconsistente.",
    "falencia": "Detección de inconsistencia a partir de una fila contradictoria."
  },
  {
    "id": "s02_p10",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al reducir la matriz aumentada de un sistema se obtiene  [1 0 2 | 3; 0 1 -1 | 4; 0 0 0 | 0]. ¿Cómo es el sistema?",
    "opciones": [
      {
        "id": "a",
        "texto": "Inconsistente."
      },
      {
        "id": "b",
        "texto": "Consistente con solución única."
      },
      {
        "id": "c",
        "texto": "Consistente con infinitas soluciones (una variable libre)."
      },
      {
        "id": "d",
        "texto": "No hay suficiente información para decidir."
      }
    ],
    "correcta": "c",
    "explicacion": "La fila 3 es 0=0 (no hay contradicción). El rango es r=2 y hay n=3 incógnitas, así que hay n-r=1 variable libre: infinitas soluciones.",
    "falencia": "Clasificar un sistema a partir de su forma escalonada reducida."
  },
  {
    "id": "s02_p11",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al reducir un sistema 3x3 aparece en algún paso la fila  [0 0 0 | -2]. ¿Qué se puede concluir de inmediato, sin seguir reduciendo?",
    "opciones": [
      {
        "id": "a",
        "texto": "El sistema tiene infinitas soluciones."
      },
      {
        "id": "b",
        "texto": "El sistema es inconsistente: no hace falta seguir reduciendo."
      },
      {
        "id": "c",
        "texto": "El sistema tiene solución única."
      },
      {
        "id": "d",
        "texto": "Falta más información para decidir."
      }
    ],
    "correcta": "b",
    "explicacion": "Esa fila representa 0=-2, una contradicción irreversible: en cuanto aparece, el sistema queda determinado como inconsistente sin importar el resto de la matriz.",
    "falencia": "Detección temprana de inconsistencia durante la reducción."
  },
  {
    "id": "s02_p12",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Sea r el número de pivotes de la matriz aumentada [A|b] y r' el número de pivotes de A sola. El sistema es inconsistente cuando:",
    "opciones": [
      {
        "id": "a",
        "texto": "r = r' = n."
      },
      {
        "id": "b",
        "texto": "r' < r."
      },
      {
        "id": "c",
        "texto": "r' > r."
      },
      {
        "id": "d",
        "texto": "r = n."
      }
    ],
    "correcta": "b",
    "explicacion": "Si r'<r, hay un pivote adicional en la columna de b, es decir, una fila del tipo [0...0|c] con c≠0: eso es exactamente una contradicción.",
    "falencia": "Teorema de número de soluciones a partir del rango de A y de [A|b]."
  },
  {
    "id": "s02_p13",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Un sistema consistente con r = n (número de pivotes igual al número de incógnitas) tiene:",
    "opciones": [
      {
        "id": "a",
        "texto": "Infinitas soluciones."
      },
      {
        "id": "b",
        "texto": "Solución única."
      },
      {
        "id": "c",
        "texto": "Ninguna solución."
      },
      {
        "id": "d",
        "texto": "Depende del valor de m."
      }
    ],
    "correcta": "b",
    "explicacion": "Si r=n no quedan variables libres (cada incógnita tiene su propio pivote), así que la solución queda completamente determinada: es única.",
    "falencia": "Teorema de número de soluciones: r=n implica solución única."
  },
  {
    "id": "s02_p14",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "¿Cuál es la diferencia principal entre la eliminación gaussiana (forma escalonada) y la eliminación de Gauss-Jordan (forma escalonada reducida)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Gauss-Jordan no requiere pivotes."
      },
      {
        "id": "b",
        "texto": "Gauss-Jordan continúa hasta hacer cero también los elementos arriba de cada pivote, evitando la sustitución hacia atrás; la eliminación gaussiana se detiene en forma escalonada y requiere sustitución hacia atrás."
      },
      {
        "id": "c",
        "texto": "Son exactamente el mismo algoritmo con nombres distintos."
      },
      {
        "id": "d",
        "texto": "Gauss-Jordan solo aplica a sistemas homogéneos."
      }
    ],
    "correcta": "b",
    "explicacion": "Ambos métodos usan las mismas operaciones elementales; la diferencia es hasta dónde se reduce la matriz: Gauss-Jordan llega a RREF (sin sustitución hacia atrás), la gaussiana se detiene antes y requiere ese paso final.",
    "falencia": "Diferencia entre eliminación gaussiana y eliminación de Gauss-Jordan."
  },
  {
    "id": "s02_p15",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "¿Cuál matriz está en forma escalonada (no necesariamente reducida) pero NO en forma escalonada reducida (RREF)?",
    "opciones": [
      {
        "id": "a",
        "texto": "[1 0 0; 0 1 0; 0 0 1]"
      },
      {
        "id": "b",
        "texto": "[1 3 2; 0 1 -1; 0 0 1]"
      },
      {
        "id": "c",
        "texto": "[1 0 0; 0 1 0; 0 0 0]"
      },
      {
        "id": "d",
        "texto": "[0 0 0; 0 0 0; 0 0 0]"
      }
    ],
    "correcta": "b",
    "explicacion": "En (b) los pivotes están correctamente escalonados, pero hay elementos no nulos arriba de los pivotes (3 y 2 en la fila 1, -1 en la fila 2): no es RREF. En (a), (c) y (d) sí se cumple la condición de RREF.",
    "falencia": "Distinguir forma escalonada de forma escalonada reducida (RREF)."
  },
  {
    "id": "s02_p16",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver por Gauss-Jordan el sistema  x + y = 7,  x - y = 1.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x,y) = (4,3)."
      },
      {
        "id": "b",
        "texto": "(x,y) = (3,4)."
      },
      {
        "id": "c",
        "texto": "(x,y) = (7,1)."
      },
      {
        "id": "d",
        "texto": "(x,y) = (1,7)."
      }
    ],
    "correcta": "a",
    "explicacion": "Sumando ambas ecuaciones: 2x=8, x=4; sustituyendo, y=3. Verificación: 4-3=1 ✓.",
    "falencia": "Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan."
  },
  {
    "id": "s02_p17",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver por Gauss-Jordan el sistema  x1 + x2 = 4,  x1 - x2 = 2.",
    "opciones": [
      {
        "id": "a",
        "texto": "x1 = 3, x2 = 1."
      },
      {
        "id": "b",
        "texto": "x1 = 1, x2 = 3."
      },
      {
        "id": "c",
        "texto": "x1 = 4, x2 = 0."
      },
      {
        "id": "d",
        "texto": "x1 = 2, x2 = 2."
      }
    ],
    "correcta": "a",
    "explicacion": "Sumando ambas ecuaciones: 2x1=6, x1=3; sustituyendo, x2=1. Verificación: 3-1=2 ✓.",
    "falencia": "Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan."
  },
  {
    "id": "s02_p18",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver por Gauss-Jordan el sistema  x1+x2+x3=6,  x1-x2+2x3=5,  2x1+x2-x3=1.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x1,x2,x3) = (1,2,3)."
      },
      {
        "id": "b",
        "texto": "(x1,x2,x3) = (3,2,1)."
      },
      {
        "id": "c",
        "texto": "(x1,x2,x3) = (2,1,3)."
      },
      {
        "id": "d",
        "texto": "(x1,x2,x3) = (1,3,2)."
      }
    ],
    "correcta": "a",
    "explicacion": "Reduciendo el sistema (por ejemplo eliminando x1 de las ecuaciones 2 y 3, luego x2 de la 3) se obtiene x3=3, y por sustitución hacia atrás x2=2 y x1=1. Verificación en las tres ecuaciones: 1+2+3=6, 1-2+6=5, 2+2-3=1, todas correctas.",
    "falencia": "Resolución de un sistema 3x3 con solución única mediante Gauss-Jordan."
  },
  {
    "id": "s02_p19",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "El sistema  x1+2x2-x3=5,  2x1+4x2-2x3=10  (la segunda ecuación es el doble de la primera). ¿Cuál es su solución general?",
    "opciones": [
      {
        "id": "a",
        "texto": "x1 = 5-2s+t, x2 = s, x3 = t, con s,t libres."
      },
      {
        "id": "b",
        "texto": "x1 = 5+2s-t, x2 = s, x3 = t, con s,t libres."
      },
      {
        "id": "c",
        "texto": "x1=5, x2=0, x3=0 (solución única)."
      },
      {
        "id": "d",
        "texto": "El sistema es inconsistente."
      }
    ],
    "correcta": "a",
    "explicacion": "Al ser la segunda ecuación múltiplo de la primera, el rango es r=1 con n=3 incógnitas: hay n-r=2 variables libres. Tomando x2=s, x3=t libres, de la primera ecuación x1 = 5-2s+t.",
    "falencia": "Parametrización de la solución general cuando hay variables libres."
  },
  {
    "id": "s02_p20",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al reducir la matriz aumentada  [1 -1 3 | 2; 2 -2 6 | 4; 1 0 1 | 3]  se observa que la fila 2 es exactamente el doble de la fila 1. ¿Cuántas variables libres tiene este sistema 3x3?",
    "opciones": [
      {
        "id": "a",
        "texto": "0."
      },
      {
        "id": "b",
        "texto": "1."
      },
      {
        "id": "c",
        "texto": "2."
      },
      {
        "id": "d",
        "texto": "3."
      }
    ],
    "correcta": "b",
    "explicacion": "La fila 2 es redundante (2 veces la fila 1), así que solo hay 2 ecuaciones realmente independientes (filas 1 y 3) para 3 incógnitas: rango r=2, variables libres = n-r = 3-2 = 1.",
    "falencia": "Reconocer ecuaciones redundantes y contar variables libres."
  },
  {
    "id": "s02_p21",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Un circuito de tres mallas produce el sistema (corrientes en amperios)  2I1-I2=5,  -I1+3I2-I3=0,  -I2+2I3=1. ¿Cuál es el valor de I2?",
    "opciones": [
      {
        "id": "a",
        "texto": "I2 = 3/2 A."
      },
      {
        "id": "b",
        "texto": "I2 = 13/4 A."
      },
      {
        "id": "c",
        "texto": "I2 = 5/4 A."
      },
      {
        "id": "d",
        "texto": "I2 = 1 A."
      }
    ],
    "correcta": "a",
    "explicacion": "Resolviendo el sistema (por sustitución o Gauss-Jordan) se obtiene I1=13/4 A, I2=3/2 A, I3=5/4 A. El valor pedido es I2=3/2 A.",
    "falencia": "Resolución de un sistema 3x3 de corrientes de malla (ley de voltajes de Kirchhoff)."
  },
  {
    "id": "s02_p22",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Un circuito de dos mallas produce el sistema  3I1-I2=6,  -I1+2I2=1. ¿Cuál es el valor de I1?",
    "opciones": [
      {
        "id": "a",
        "texto": "I1 = 13/5 A."
      },
      {
        "id": "b",
        "texto": "I1 = 9/5 A."
      },
      {
        "id": "c",
        "texto": "I1 = 6/5 A."
      },
      {
        "id": "d",
        "texto": "I1 = 1 A."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación: I1=2I2-1. Sustituyendo en la primera: 3(2I2-1)-I2=6 => 5I2=9 => I2=9/5, y entonces I1=2(9/5)-1=13/5 A.",
    "falencia": "Resolución de un sistema 2x2 de corrientes de malla (ley de voltajes de Kirchhoff)."
  },
  {
    "id": "s02_p23",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "La solución trivial de un sistema homogéneo Ax=0 es:",
    "opciones": [
      {
        "id": "a",
        "texto": "x = (1,1,...,1)."
      },
      {
        "id": "b",
        "texto": "x = (0,0,...,0)."
      },
      {
        "id": "c",
        "texto": "Cualquier solución no nula."
      },
      {
        "id": "d",
        "texto": "No siempre existe."
      }
    ],
    "correcta": "b",
    "explicacion": "x=0 satisface A·0=0 en cada ecuación (0=0), así que el vector cero siempre es solución de todo sistema homogéneo: es la solución trivial.",
    "falencia": "Definición de solución trivial en sistemas homogéneos."
  },
  {
    "id": "s02_p24",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Un sistema homogéneo tiene soluciones no triviales si y solo si:",
    "opciones": [
      {
        "id": "a",
        "texto": "El número de pivotes r es igual a n."
      },
      {
        "id": "b",
        "texto": "El número de pivotes r es menor que n (hay al menos una variable libre)."
      },
      {
        "id": "c",
        "texto": "m > n."
      },
      {
        "id": "d",
        "texto": "El sistema es inconsistente."
      }
    ],
    "correcta": "b",
    "explicacion": "Si r<n hay al menos una variable libre, que puede tomar cualquier valor distinto de cero y generar soluciones no triviales. Si r=n, la única solución es la trivial. (Un sistema homogéneo nunca es inconsistente.)",
    "falencia": "Condición para la existencia de soluciones no triviales en un sistema homogéneo."
  },
  {
    "id": "s02_p25",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver el sistema homogéneo  x1-2x2+x3=0,  2x1-4x2+2x3=0  (la segunda es el doble de la primera).",
    "opciones": [
      {
        "id": "a",
        "texto": "x1=2s-t, x2=s, x3=t, con s,t libres."
      },
      {
        "id": "b",
        "texto": "x1=2s+t, x2=s, x3=t, con s,t libres."
      },
      {
        "id": "c",
        "texto": "Solo la solución trivial (0,0,0)."
      },
      {
        "id": "d",
        "texto": "El sistema es inconsistente."
      }
    ],
    "correcta": "a",
    "explicacion": "Al ser la segunda ecuación múltiplo de la primera, r=1 y n=3: hay 2 variables libres, x2=s y x3=t. De la primera ecuación: x1 = 2x2-x3 = 2s-t.",
    "falencia": "Resolución de un sistema homogéneo con variables libres."
  },
  {
    "id": "s02_p26",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "Un sistema homogéneo tiene m=4 ecuaciones y n=4 incógnitas, y su matriz de coeficientes A tiene 4 pivotes tras reducirla. ¿Tiene soluciones no triviales?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, siempre."
      },
      {
        "id": "b",
        "texto": "No: r=n=4, no hay variables libres, así que la única solución es la trivial."
      },
      {
        "id": "c",
        "texto": "Sí, porque m=n."
      },
      {
        "id": "d",
        "texto": "No se puede determinar con esta información."
      }
    ],
    "correcta": "b",
    "explicacion": "Con r=n=4 no queda ninguna variable libre: la única solución del sistema homogéneo es la trivial x=0.",
    "falencia": "Aplicar el criterio r=n (sin variables libres) a un sistema homogéneo concreto."
  },
  {
    "id": "s02_p27",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "En el sistema  x+ky=1,  kx+y=1, ¿qué ocurre cuando k=-1?",
    "opciones": [
      {
        "id": "a",
        "texto": "El sistema es inconsistente (se llega a 0=2)."
      },
      {
        "id": "b",
        "texto": "Infinitas soluciones."
      },
      {
        "id": "c",
        "texto": "Solución única x=y=1/2."
      },
      {
        "id": "d",
        "texto": "Solución única x=y=-1."
      }
    ],
    "correcta": "a",
    "explicacion": "Reduciendo la matriz aumentada se obtiene la fila 2 = [0, 1-k² | 1-k]. Con k=-1: 1-k²=0 y 1-k=2, así que la fila queda [0 0 | 2], es decir 0=2: contradicción, sistema inconsistente.",
    "falencia": "Discusión de un sistema 2x2 con parámetro k: caso inconsistente."
  },
  {
    "id": "s02_p28",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "En el sistema  x+ky=1,  kx+y=1, ¿qué ocurre cuando k=1?",
    "opciones": [
      {
        "id": "a",
        "texto": "Infinitas soluciones: x+y=1."
      },
      {
        "id": "b",
        "texto": "El sistema es inconsistente."
      },
      {
        "id": "c",
        "texto": "Solución única (1,0)."
      },
      {
        "id": "d",
        "texto": "Solo la solución trivial."
      }
    ],
    "correcta": "a",
    "explicacion": "Con k=1, la fila 2 = [0, 1-k² | 1-k] = [0 0 | 0], es decir 0=0 (sin contradicción): queda solo la ecuación x+y=1, con infinitas soluciones.",
    "falencia": "Discusión de un sistema 2x2 con parámetro k: caso de infinitas soluciones."
  },
  {
    "id": "s02_p29",
    "semanaId": 2,
    "tipo": "teoria",
    "pregunta": "En el contexto de la eliminación de Gauss-Jordan, el \"rango\" de una matriz se define como:",
    "opciones": [
      {
        "id": "a",
        "texto": "El número de columnas de la matriz."
      },
      {
        "id": "b",
        "texto": "El número de filas no nulas (pivotes) en su forma escalonada."
      },
      {
        "id": "c",
        "texto": "El número de incógnitas del sistema."
      },
      {
        "id": "d",
        "texto": "El valor del término independiente más grande."
      }
    ],
    "correcta": "b",
    "explicacion": "El rango de una matriz es el número de pivotes (filas no nulas) que quedan al llevarla a forma escalonada; este número determina si un sistema es inconsistente, tiene solución única, o infinitas soluciones.",
    "falencia": "Definición de rango de una matriz."
  },
  {
    "id": "s02_p30",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver por Gauss-Jordan el sistema  x1 + 2x2 = 7,  3x1 - x2 = 0.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x1,x2) = (1,3)."
      },
      {
        "id": "b",
        "texto": "(x1,x2) = (3,1)."
      },
      {
        "id": "c",
        "texto": "(x1,x2) = (7,0)."
      },
      {
        "id": "d",
        "texto": "(x1,x2) = (0,7)."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación x2=3x1. Sustituyendo en la primera: x1+2(3x1)=7 => 7x1=7 => x1=1, y entonces x2=3. Verificación: 3(1)-3=0 ✓.",
    "falencia": "Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan."
  },
  {
    "id": "s02_p31",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver el sistema  x1+x2+x3=6,  x1-x2+x3=2,  x1+x2-x3=0.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x1,x2,x3) = (1,2,3)."
      },
      {
        "id": "b",
        "texto": "(x1,x2,x3) = (3,2,1)."
      },
      {
        "id": "c",
        "texto": "(x1,x2,x3) = (2,1,3)."
      },
      {
        "id": "d",
        "texto": "(x1,x2,x3) = (1,3,2)."
      }
    ],
    "correcta": "a",
    "explicacion": "Restando la ecuación 2 de la 1: 2x2=4 => x2=2. Restando la ecuación 3 de la 1: 2x3=6 => x3=3. Sustituyendo en la primera: x1=6-2-3=1. Verificación en las tres ecuaciones: correcta.",
    "falencia": "Resolución de un sistema 3x3 con solución única."
  },
  {
    "id": "s02_p32",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "El sistema  2x1+4x2-6x3=8,  x1+2x2-3x3=4  (la primera es el doble de la segunda). ¿Cuál es su solución general?",
    "opciones": [
      {
        "id": "a",
        "texto": "x1 = 4-2s+3t, x2 = s, x3 = t, con s,t libres."
      },
      {
        "id": "b",
        "texto": "x1 = 4+2s-3t, x2 = s, x3 = t, con s,t libres."
      },
      {
        "id": "c",
        "texto": "x1=4, x2=0, x3=0 (solución única)."
      },
      {
        "id": "d",
        "texto": "El sistema es inconsistente."
      }
    ],
    "correcta": "a",
    "explicacion": "Al ser una ecuación múltiplo de la otra, rank r=1 con n=3: hay 2 variables libres. Tomando x2=s, x3=t, de la segunda ecuación x1 = 4-2s+3t.",
    "falencia": "Parametrización de la solución general cuando hay variables libres."
  },
  {
    "id": "s02_p33",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Un sistema tiene las ecuaciones  x1+x2+x3=1,  2x1+2x2+2x3=5  (más una tercera ecuación cualquiera). ¿Qué se puede afirmar del sistema sin importar la tercera ecuación?",
    "opciones": [
      {
        "id": "a",
        "texto": "Es inconsistente: la ecuación 2 contradice a la 1 (2 veces el lado izquierdo de la 1 debería dar 2, no 5)."
      },
      {
        "id": "b",
        "texto": "Tiene solución única."
      },
      {
        "id": "c",
        "texto": "Tiene infinitas soluciones."
      },
      {
        "id": "d",
        "texto": "Depende de la tercera ecuación."
      }
    ],
    "correcta": "a",
    "explicacion": "El lado izquierdo de la ecuación 2 es exactamente 2 veces el de la ecuación 1, así que su lado derecho debería ser 2(1)=2; pero es 5: contradicción irreversible, sin importar qué diga la tercera ecuación.",
    "falencia": "Detectar una contradicción entre dos ecuaciones antes de terminar de reducir el sistema."
  },
  {
    "id": "s02_p34",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Sistema homogéneo  x1+x2+x3=0,  x1-x2+x3=0,  2x1+x3=0. ¿Tiene soluciones no triviales?",
    "opciones": [
      {
        "id": "a",
        "texto": "No, solo la trivial (0,0,0): el rango es r=n=3."
      },
      {
        "id": "b",
        "texto": "Sí: x1=t, x2=0, x3=-2t."
      },
      {
        "id": "c",
        "texto": "Sí, siempre que m<n."
      },
      {
        "id": "d",
        "texto": "No se puede determinar."
      }
    ],
    "correcta": "a",
    "explicacion": "Restando las dos primeras ecuaciones se obtiene x2=0; con la tercera, x3=-2x1; sustituyendo en la primera, -x1=0, así que x1=0 y por tanto x3=0. El rango es 3 (=n), no hay variables libres: solo la solución trivial.",
    "falencia": "Determinar si un sistema homogéneo tiene soluciones no triviales."
  },
  {
    "id": "s02_p35",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Sistema homogéneo  x1+2x2-x3=0,  2x1+4x2-2x3=0,  -x1-2x2+x3=0  (las tres ecuaciones son múltiplos entre sí). ¿Cuál es la solución general?",
    "opciones": [
      {
        "id": "a",
        "texto": "x1=-2s+t, x2=s, x3=t, con s,t libres."
      },
      {
        "id": "b",
        "texto": "Solo la solución trivial (0,0,0)."
      },
      {
        "id": "c",
        "texto": "El sistema es inconsistente."
      },
      {
        "id": "d",
        "texto": "x1=2s-t, x2=s, x3=t, con s,t libres."
      }
    ],
    "correcta": "a",
    "explicacion": "Las tres ecuaciones son múltiplos de la primera, así que rango r=1 y n=3: hay 2 variables libres. Tomando x2=s, x3=t: x1 = -2x2+x3 = -2s+t.",
    "falencia": "Resolución de un sistema homogéneo con variables libres."
  },
  {
    "id": "s02_p36",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Un circuito de tres mallas produce el sistema (corrientes en amperios)  I1+I2=4,  -I1+2I2-I3=1,  -I2+3I3=2. ¿Cuál es el valor de I3?",
    "opciones": [
      {
        "id": "a",
        "texto": "I3 = 11/8 A."
      },
      {
        "id": "b",
        "texto": "I3 = 15/8 A."
      },
      {
        "id": "c",
        "texto": "I3 = 17/8 A."
      },
      {
        "id": "d",
        "texto": "I3 = 1 A."
      }
    ],
    "correcta": "a",
    "explicacion": "Resolviendo el sistema (por sustitución o Gauss-Jordan) se obtiene I1=15/8 A, I2=17/8 A, I3=11/8 A.",
    "falencia": "Resolución de un sistema 3x3 de corrientes de malla (ley de voltajes de Kirchhoff)."
  },
  {
    "id": "s02_p37",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Para el sistema  x + 2y = 3,  2x + ky = 6, ¿qué valor de k produce infinitas soluciones?",
    "opciones": [
      {
        "id": "a",
        "texto": "k = 4."
      },
      {
        "id": "b",
        "texto": "k = 2."
      },
      {
        "id": "c",
        "texto": "k = 6."
      },
      {
        "id": "d",
        "texto": "k = -4."
      }
    ],
    "correcta": "a",
    "explicacion": "Con k=4, la segunda ecuación es exactamente 2 veces la primera (2(x+2y)=2x+4y=6): misma recta, infinitas soluciones.",
    "falencia": "Determinar un parámetro que hace indeterminado un sistema 2x2."
  },
  {
    "id": "s02_p38",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Clasificar el sistema  x + 2y = 3,  2x + 4y = 9.",
    "opciones": [
      {
        "id": "a",
        "texto": "Inconsistente."
      },
      {
        "id": "b",
        "texto": "Consistente determinado (solución única)."
      },
      {
        "id": "c",
        "texto": "Consistente indeterminado (infinitas soluciones)."
      },
      {
        "id": "d",
        "texto": "Homogéneo."
      }
    ],
    "correcta": "a",
    "explicacion": "Los coeficientes son proporcionales (1/2 = 2/4), pero los términos independientes no (3/9=1/3 ≠ 1/2): rectas paralelas distintas, sistema inconsistente.",
    "falencia": "Clasificación de sistemas 2x2 por proporcionalidad de coeficientes."
  },
  {
    "id": "s02_p39",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Resolver por Gauss-Jordan el sistema  2x1 - 3x2 = -4,  x1 + x2 = 3.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x1,x2) = (1,2)."
      },
      {
        "id": "b",
        "texto": "(x1,x2) = (2,1)."
      },
      {
        "id": "c",
        "texto": "(x1,x2) = (3,0)."
      },
      {
        "id": "d",
        "texto": "(x1,x2) = (-1,4)."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación x1=3-x2. Sustituyendo en la primera: 2(3-x2)-3x2=-4 => 6-5x2=-4 => x2=2, y entonces x1=1. Verificación: 2(1)-3(2)=-4 ✓.",
    "falencia": "Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan."
  },
  {
    "id": "s02_p40",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Una matriz aumentada de un sistema con 4 ecuaciones y 4 incógnitas se reduce y queda con 3 pivotes. Si el sistema es consistente, ¿cuántas variables libres tiene?",
    "opciones": [
      {
        "id": "a",
        "texto": "0."
      },
      {
        "id": "b",
        "texto": "1."
      },
      {
        "id": "c",
        "texto": "2."
      },
      {
        "id": "d",
        "texto": "3."
      }
    ],
    "correcta": "b",
    "explicacion": "El número de variables libres es n-r = 4-3 = 1.",
    "falencia": "Contar variables libres a partir del rango y del número de incógnitas."
  },
  {
    "id": "s02_p41",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Un sistema homogéneo tiene m=2 ecuaciones y n=4 incógnitas. ¿Está garantizado que tiene soluciones no triviales?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí: como m<n, el rango r≤m<n, así que siempre hay al menos una variable libre."
      },
      {
        "id": "b",
        "texto": "No, depende de la matriz A."
      },
      {
        "id": "c",
        "texto": "Solo si m=n."
      },
      {
        "id": "d",
        "texto": "Nunca, un sistema homogéneo solo tiene la solución trivial."
      }
    ],
    "correcta": "a",
    "explicacion": "El rango r nunca puede superar m; con m<n se cumple r≤m<n, así que siempre queda al menos una variable libre y, por tanto, soluciones no triviales garantizadas.",
    "falencia": "Garantía de soluciones no triviales cuando m<n en un sistema homogéneo."
  },
  {
    "id": "s02_p42",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al reducir la matriz aumentada  [1 2 -1 | 3; 2 4 -2 | 6; 1 1 1 | 2]  se observa que la fila 2 es exactamente el doble de la fila 1. ¿Cuántas variables libres tiene este sistema 3x3 (si es consistente)?",
    "opciones": [
      {
        "id": "a",
        "texto": "0."
      },
      {
        "id": "b",
        "texto": "1."
      },
      {
        "id": "c",
        "texto": "2."
      },
      {
        "id": "d",
        "texto": "El sistema es inconsistente."
      }
    ],
    "correcta": "b",
    "explicacion": "La fila 2 es redundante, así que solo hay 2 ecuaciones independientes (filas 1 y 3) para 3 incógnitas: rango r=2, variables libres = n-r = 3-2 = 1. No hay contradicción, el sistema es consistente.",
    "falencia": "Reconocer ecuaciones redundantes y contar variables libres."
  },
  {
    "id": "s02_p43",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al reducir una matriz aumentada aparece una fila completa de ceros, incluida la columna de términos independientes: [0 0 0 | 0]. ¿Qué representa esa fila?",
    "opciones": [
      {
        "id": "a",
        "texto": "Una contradicción (0=c, c≠0)."
      },
      {
        "id": "b",
        "texto": "Una ecuación redundante (0=0) que no aporta ninguna restricción nueva."
      },
      {
        "id": "c",
        "texto": "Que el sistema es homogéneo."
      },
      {
        "id": "d",
        "texto": "Que el sistema tiene solución única."
      }
    ],
    "correcta": "b",
    "explicacion": "0=0 es una identidad siempre verdadera: esa ecuación no restringe nada nuevo (era combinación lineal de las demás), no representa una contradicción.",
    "falencia": "Interpretar una fila de ceros (0=0) al reducir un sistema."
  },
  {
    "id": "s02_p44",
    "semanaId": 2,
    "tipo": "ejercicio",
    "pregunta": "Al reducir un sistema, el número de pivotes r es igual al número de ecuaciones m, pero menor que el número de incógnitas n (r=m<n), y el sistema es consistente. ¿Qué tipo de sistema es?",
    "opciones": [
      {
        "id": "a",
        "texto": "Determinado (solución única)."
      },
      {
        "id": "b",
        "texto": "Indeterminado, con n-r variables libres."
      },
      {
        "id": "c",
        "texto": "Inconsistente."
      },
      {
        "id": "d",
        "texto": "Homogéneo únicamente."
      }
    ],
    "correcta": "b",
    "explicacion": "Con r<n quedan n-r columnas sin pivote, es decir n-r variables libres: el sistema consistente es indeterminado (infinitas soluciones).",
    "falencia": "Clasificar un sistema consistente a partir de la relación entre r y n."
  }
];
