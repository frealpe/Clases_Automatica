const PREGUNTAS = [
  {
    "id": "s01_p1",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "¿Cuál es la interpretación geométrica de un sistema de 2 ecuaciones lineales con 2 incógnitas que NO tiene solución (inconsistente)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Las dos rectas coinciden en todos sus puntos."
      },
      {
        "id": "b",
        "texto": "Las dos rectas se intersecan en un único punto."
      },
      {
        "id": "c",
        "texto": "Las dos rectas son paralelas y no se intersecan."
      },
      {
        "id": "d",
        "texto": "Las rectas forman un ángulo recto entre sí."
      }
    ],
    "correcta": "c",
    "explicacion": "Un sistema inconsistente no posee puntos en común, lo cual geométricamente representa dos rectas paralelas distintas en R² (Propiedad \"Los tres casos\", semana 1, sección 2).",
    "falencia": "Interpretación geométrica de sistemas 2x2 e inconsistencia de rectas."
  },
  {
    "id": "s01_p2",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema de ecuaciones 2x - 3y = 7 y 4x - 6y = 14, ¿cómo se clasifica este sistema?",
    "opciones": [
      {
        "id": "a",
        "texto": "Inconsistente (sin solución)."
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
        "texto": "Sistema homogéneo trivial."
      }
    ],
    "correcta": "c",
    "explicacion": "La segunda ecuación es exactamente el doble de la primera (4x-6y = 2·(2x-3y) = 14), por lo que ambas representan la misma recta: hay infinitas soluciones.",
    "falencia": "Identificación de sistemas dependientes (rectas coincidentes) e infinitas soluciones."
  },
  {
    "id": "s01_p3",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  x1 + x2 + x3 = 2,  2x1 - x2 + x3 = 6, ¿la tupla (x1,x2,x3) = (2,-1,1) es solución del sistema?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, satisface ambas ecuaciones."
      },
      {
        "id": "b",
        "texto": "No, falla en la primera ecuación."
      },
      {
        "id": "c",
        "texto": "No, falla en la segunda ecuación."
      },
      {
        "id": "d",
        "texto": "No, falla en ambas ecuaciones."
      }
    ],
    "correcta": "a",
    "explicacion": "Ecuación 1: 2+(-1)+1=2 ✓. Ecuación 2: 2(2)-(-1)+1=4+1+1=6 ✓. La tupla satisface las dos ecuaciones simultáneamente.",
    "falencia": "Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p4",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "En el sistema  2x1 - x2 + 3x3 = 5,  x1 + x2 - x3 = 0, ¿cuántas ecuaciones (m) e incógnitas (n) tiene, y cuál es el coeficiente a12 (coeficiente de x2 en la ecuación 1)?",
    "opciones": [
      {
        "id": "a",
        "texto": "m=2, n=3, a12 = -1."
      },
      {
        "id": "b",
        "texto": "m=3, n=2, a12 = 2."
      },
      {
        "id": "c",
        "texto": "m=2, n=3, a12 = 3."
      },
      {
        "id": "d",
        "texto": "m=2, n=2, a12 = -1."
      }
    ],
    "correcta": "a",
    "explicacion": "El sistema tiene 2 ecuaciones (m=2) y 3 incógnitas (n=3); el coeficiente de x2 en la primera ecuación es a12=-1.",
    "falencia": "Identificación de m, n y coeficientes a_ij en la forma general de un sistema lineal."
  },
  {
    "id": "s01_p5",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "¿Cuál de las siguientes ecuaciones ES una ecuación lineal en sus variables?",
    "opciones": [
      {
        "id": "a",
        "texto": "3x + 2y - xy = 5"
      },
      {
        "id": "b",
        "texto": "x1 - 2x2 + 5x3 = 7"
      },
      {
        "id": "c",
        "texto": "sqrt(x) + y = 3"
      },
      {
        "id": "d",
        "texto": "1/x + y = 2"
      }
    ],
    "correcta": "b",
    "explicacion": "En una ecuación lineal ninguna variable aparece elevada a potencia distinta de 1, multiplicada por otra variable, ni dentro de una función no lineal. (a) tiene el producto xy, (c) tiene una raíz, (d) tiene 1/x: ninguna es lineal. Solo (b) cumple la definición.",
    "falencia": "Identificación de ecuación lineal vs. no lineal."
  },
  {
    "id": "s01_p6",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "¿Cuál de las siguientes ecuaciones NO es lineal?",
    "opciones": [
      {
        "id": "a",
        "texto": "4x1 - x2 + 0x3 = 9"
      },
      {
        "id": "b",
        "texto": "x1 x2 - 3x3 = 1"
      },
      {
        "id": "c",
        "texto": "-x1 + 2x2 - x3 = 0"
      },
      {
        "id": "d",
        "texto": "0.5x1 + x2 = 7"
      }
    ],
    "correcta": "b",
    "explicacion": "El término x1 x2 multiplica dos variables entre sí, lo cual viola la definición de linealidad aunque el resto de la ecuación luzca simple. Las opciones (a), (c) y (d) sí son lineales.",
    "falencia": "Reconocer términos no lineales (productos de variables) en una ecuación."
  },
  {
    "id": "s01_p7",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "Dado el sistema  x1 - 2x2 + 4x3 = 7,  3x1 + x2 - x3 = -2, ¿cuántas ecuaciones (m), cuántas incógnitas (n) tiene, y cuál es el coeficiente a21 (coeficiente de x1 en la ecuación 2)?",
    "opciones": [
      {
        "id": "a",
        "texto": "m=2, n=3, a21 = 3."
      },
      {
        "id": "b",
        "texto": "m=3, n=2, a21 = -2."
      },
      {
        "id": "c",
        "texto": "m=2, n=3, a21 = -1."
      },
      {
        "id": "d",
        "texto": "m=2, n=2, a21 = 3."
      }
    ],
    "correcta": "a",
    "explicacion": "El sistema tiene 2 ecuaciones (m=2) y 3 incógnitas (n=3); a21 es el coeficiente de x1 en la ecuación 2, que vale 3.",
    "falencia": "Identificación de m, n y coeficientes a_ij en la forma general de un sistema lineal."
  },
  {
    "id": "s01_p8",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "Dado el sistema  2x1 + 3x2 - x3 = -5,  -x1 + x2 + 4x3 = 8, ¿cuáles son los términos independientes b1 y b2?",
    "opciones": [
      {
        "id": "a",
        "texto": "b1 = -5, b2 = 8."
      },
      {
        "id": "b",
        "texto": "b1 = 2, b2 = -1."
      },
      {
        "id": "c",
        "texto": "b1 = 8, b2 = -5."
      },
      {
        "id": "d",
        "texto": "b1 = -5, b2 = 4."
      }
    ],
    "correcta": "a",
    "explicacion": "El término independiente de cada ecuación es el valor a la derecha del signo igual: b1=-5 (ecuación 1) y b2=8 (ecuación 2).",
    "falencia": "Identificación del término independiente en la forma general de un sistema."
  },
  {
    "id": "s01_p9",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "Un sistema \"consistente determinado\" tiene:",
    "opciones": [
      {
        "id": "a",
        "texto": "Ninguna solución."
      },
      {
        "id": "b",
        "texto": "Exactamente una solución."
      },
      {
        "id": "c",
        "texto": "Infinitas soluciones."
      },
      {
        "id": "d",
        "texto": "Exactamente dos soluciones."
      }
    ],
    "correcta": "b",
    "explicacion": "Consistente significa que tiene al menos una solución, y determinado significa que esa solución es única: juntos, exactamente una solución.",
    "falencia": "Terminología: consistente/inconsistente, determinado/indeterminado."
  },
  {
    "id": "s01_p10",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "¿Puede un sistema de ecuaciones lineales tener exactamente 2 soluciones distintas (ni una, ni infinitas)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, siempre que el sistema sea 2x2."
      },
      {
        "id": "b",
        "texto": "No: un sistema lineal consistente tiene una única solución o infinitas, nunca un número finito mayor que uno."
      },
      {
        "id": "c",
        "texto": "Sí, si las dos rectas son paralelas."
      },
      {
        "id": "d",
        "texto": "Sí, si el sistema es homogéneo."
      }
    ],
    "correcta": "b",
    "explicacion": "Es una propiedad general de los sistemas lineales (ya observable en el caso 2x2): el conjunto solución es vacío, un único punto, o infinito — nunca un número finito mayor que uno.",
    "falencia": "Por qué un sistema lineal nunca tiene un número finito de soluciones mayor que 1."
  },
  {
    "id": "s01_p11",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  x1 - x2 + 2x3 = 3,  2x1 + x2 - x3 = 4, ¿la tupla (x1,x2,x3) = (1,0,1) es solución?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, satisface ambas ecuaciones."
      },
      {
        "id": "b",
        "texto": "No, falla en la primera ecuación."
      },
      {
        "id": "c",
        "texto": "No, falla en la segunda ecuación."
      },
      {
        "id": "d",
        "texto": "No, falla en ambas ecuaciones."
      }
    ],
    "correcta": "c",
    "explicacion": "Ecuación 1: 1-0+2(1)=3 ✓. Ecuación 2: 2(1)+0-1=1, pero debería dar 4: no se cumple. Falla solo en la segunda ecuación.",
    "falencia": "Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p12",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  3x + y = 11,  x - 2y = -1, ¿la tupla (x,y) = (3,2) es solución?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, satisface ambas ecuaciones."
      },
      {
        "id": "b",
        "texto": "No, falla en la primera ecuación."
      },
      {
        "id": "c",
        "texto": "No, falla en la segunda ecuación."
      },
      {
        "id": "d",
        "texto": "No, falla en ambas ecuaciones."
      }
    ],
    "correcta": "a",
    "explicacion": "Ecuación 1: 3(3)+2=11 ✓. Ecuación 2: 3-2(2)=3-4=-1 ✓. La tupla satisface ambas ecuaciones.",
    "falencia": "Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p13",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  x + y = 4,  2x - y = 1, ¿la tupla (x,y) = (0,0) es solución?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, satisface ambas ecuaciones."
      },
      {
        "id": "b",
        "texto": "No, falla en la primera ecuación."
      },
      {
        "id": "c",
        "texto": "No, falla en la segunda ecuación."
      },
      {
        "id": "d",
        "texto": "No, falla en ambas ecuaciones."
      }
    ],
    "correcta": "d",
    "explicacion": "Ecuación 1: 0+0=0, debería dar 4: no se cumple. Ecuación 2: 2(0)-0=0, debería dar 1: tampoco se cumple. Falla en ambas.",
    "falencia": "Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p14",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  3x - 6y = 9,  x - 2y = 3, ¿cómo se clasifica?",
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
        "texto": "Sistema homogéneo."
      }
    ],
    "correcta": "c",
    "explicacion": "La primera ecuación es exactamente 3 veces la segunda (3(x-2y)=3x-6y y 3(3)=9): representan la misma recta, así que hay infinitas soluciones.",
    "falencia": "Identificación de sistemas dependientes (rectas coincidentes) e infinitas soluciones."
  },
  {
    "id": "s01_p15",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  4x + 2y = 6,  6x + 3y = 5, ¿cómo se clasifica?",
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
        "texto": "Sistema homogéneo."
      }
    ],
    "correcta": "a",
    "explicacion": "Los coeficientes son proporcionales (4/6 = 2/3 = 2/3), pero los términos independientes no lo están (6/5 ≠ 2/3): las rectas son paralelas distintas, el sistema es inconsistente.",
    "falencia": "Identificación de rectas paralelas distintas (sistema inconsistente)."
  },
  {
    "id": "s01_p16",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  2x + y = 5,  x - y = 1, ¿cómo se clasifica (sin resolverlo)?",
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
        "texto": "Sistema homogéneo."
      }
    ],
    "correcta": "b",
    "explicacion": "Las pendientes son distintas (-2 en la primera recta, 1 en la segunda), así que las rectas son secantes y se cortan en un único punto: solución única.",
    "falencia": "Clasificación de un sistema 2x2 por comparación de pendientes."
  },
  {
    "id": "s01_p17",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Resolver por eliminación el sistema  x + y = 5,  2x - y = 1.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x,y) = (2,3)."
      },
      {
        "id": "b",
        "texto": "(x,y) = (3,2)."
      },
      {
        "id": "c",
        "texto": "(x,y) = (1,4)."
      },
      {
        "id": "d",
        "texto": "(x,y) = (4,1)."
      }
    ],
    "correcta": "a",
    "explicacion": "Sumando ambas ecuaciones: 3x=6, x=2; sustituyendo en la primera, y=3. Verificación en la segunda: 2(2)-3=1 ✓.",
    "falencia": "Resolución de sistemas 2x2 por el método de eliminación."
  },
  {
    "id": "s01_p18",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Resolver por sustitución el sistema  3x - y = 5,  x + 2y = 4.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x,y) = (2,1)."
      },
      {
        "id": "b",
        "texto": "(x,y) = (1,2)."
      },
      {
        "id": "c",
        "texto": "(x,y) = (4,-4)."
      },
      {
        "id": "d",
        "texto": "(x,y) = (-2,7)."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación: x = 4-2y. Sustituyendo en la primera: 3(4-2y)-y=5 => 12-7y=5 => y=1, y entonces x=2. Verificación: 3(2)-1=5 ✓.",
    "falencia": "Resolución de sistemas 2x2 por el método de sustitución."
  },
  {
    "id": "s01_p19",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Resolver por sustitución el sistema  2x + 3y = 12,  x - y = 1.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x,y) = (3,2)."
      },
      {
        "id": "b",
        "texto": "(x,y) = (2,3)."
      },
      {
        "id": "c",
        "texto": "(x,y) = (6,0)."
      },
      {
        "id": "d",
        "texto": "(x,y) = (0,4)."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación: x = 1+y. Sustituyendo en la primera: 2(1+y)+3y=12 => 5y=10 => y=2, y entonces x=3. Verificación: 2(3)+3(2)=12 ✓.",
    "falencia": "Resolución de sistemas 2x2 por el método de sustitución."
  },
  {
    "id": "s01_p20",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Al intentar resolver por sustitución el sistema  x - y = 2,  2x - 2y = 7, se llega a la ecuación 4=7. ¿Qué significa esto?",
    "opciones": [
      {
        "id": "a",
        "texto": "x=3, y=1."
      },
      {
        "id": "b",
        "texto": "x=2, y=0."
      },
      {
        "id": "c",
        "texto": "El sistema no tiene solución: se llegó a una contradicción."
      },
      {
        "id": "d",
        "texto": "Infinitas soluciones parametrizadas por y."
      }
    ],
    "correcta": "c",
    "explicacion": "De la primera ecuación x=2+y; al sustituir en la segunda se obtiene 2(2+y)-2y=7 => 4=7, una contradicción. Eso significa que el sistema es inconsistente (las rectas son paralelas distintas).",
    "falencia": "Reconocer una contradicción algebraica como evidencia de sistema inconsistente."
  },
  {
    "id": "s01_p21",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "Dos rectas con la misma pendiente pero distinto intercepto (no coinciden) se llaman:",
    "opciones": [
      {
        "id": "a",
        "texto": "Secantes."
      },
      {
        "id": "b",
        "texto": "Paralelas distintas."
      },
      {
        "id": "c",
        "texto": "Coincidentes."
      },
      {
        "id": "d",
        "texto": "Perpendiculares."
      }
    ],
    "correcta": "b",
    "explicacion": "Misma pendiente pero distinto intercepto significa que nunca se cruzan: son paralelas distintas, y el sistema asociado es inconsistente.",
    "falencia": "Interpretación geométrica de rectas paralelas distintas."
  },
  {
    "id": "s01_p22",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "Si un sistema 2x2 tiene solución única, geométricamente las dos rectas son:",
    "opciones": [
      {
        "id": "a",
        "texto": "Paralelas."
      },
      {
        "id": "b",
        "texto": "Coincidentes."
      },
      {
        "id": "c",
        "texto": "Secantes (se cortan en un único punto)."
      },
      {
        "id": "d",
        "texto": "No existen como rectas."
      }
    ],
    "correcta": "c",
    "explicacion": "Solución única significa un único punto que satisface ambas ecuaciones a la vez: geométricamente, las rectas se cortan en ese único punto (son secantes).",
    "falencia": "Interpretación geométrica de la solución única de un sistema 2x2."
  },
  {
    "id": "s01_p23",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Un circuito de dos mallas produce el sistema (corrientes en amperios)  3I1 - I2 = 5,  -I1 + 4I2 = 0. ¿Cuál es el valor de I1?",
    "opciones": [
      {
        "id": "a",
        "texto": "I1 = 20/11 A."
      },
      {
        "id": "b",
        "texto": "I1 = 5/11 A."
      },
      {
        "id": "c",
        "texto": "I1 = 11/20 A."
      },
      {
        "id": "d",
        "texto": "I1 = 1 A."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación: I1 = 4I2. Sustituyendo en la primera: 3(4I2)-I2=5 => 11I2=5 => I2=5/11, y entonces I1=4(5/11)=20/11 A.",
    "falencia": "Traducir y resolver un sistema de ecuaciones a partir de la ley de voltajes de Kirchhoff."
  },
  {
    "id": "s01_p24",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Se mezclan x litros de una solución al 20% de sal con y litros de una solución al 50% de sal para obtener 30 litros de una mezcla al 30%. ¿Cuántos litros de cada una se necesitan?",
    "opciones": [
      {
        "id": "a",
        "texto": "x = 20 L, y = 10 L."
      },
      {
        "id": "b",
        "texto": "x = 10 L, y = 20 L."
      },
      {
        "id": "c",
        "texto": "x = 15 L, y = 15 L."
      },
      {
        "id": "d",
        "texto": "x = 25 L, y = 5 L."
      }
    ],
    "correcta": "a",
    "explicacion": "El sistema es x+y=30 (volumen total) y 0.2x+0.5y=0.3(30)=9 (balance de sal). De la primera, x=30-y; sustituyendo: 0.2(30-y)+0.5y=9 => 0.3y=3 => y=10, x=20.",
    "falencia": "Traducir un problema de mezclas a un sistema de ecuaciones lineales y resolverlo."
  },
  {
    "id": "s01_p25",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Para el sistema  x + 2y = 4,  2x + ky = 9, ¿qué valor de k hace que el sistema sea inconsistente (sin solución)?",
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
        "texto": "k = 8."
      },
      {
        "id": "d",
        "texto": "Ningún valor de k lo hace inconsistente."
      }
    ],
    "correcta": "a",
    "explicacion": "Para que las rectas sean paralelas se necesita 1/2 = 2/k, es decir k=4. Con k=4 los términos independientes no guardan la misma proporción (4/9 ≠ 1/2), así que las rectas son paralelas distintas: el sistema es inconsistente.",
    "falencia": "Determinar un parámetro que hace inconsistente un sistema 2x2."
  },
  {
    "id": "s01_p26",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Para el sistema  x - 3y = 2,  kx - 9y = 6, ¿qué valor de k hace que el sistema tenga infinitas soluciones?",
    "opciones": [
      {
        "id": "a",
        "texto": "k = 3."
      },
      {
        "id": "b",
        "texto": "k = -3."
      },
      {
        "id": "c",
        "texto": "k = 9."
      },
      {
        "id": "d",
        "texto": "k = 6."
      }
    ],
    "correcta": "a",
    "explicacion": "Con k=3, la segunda ecuación es exactamente 3 veces la primera (3x-9y=6 equivale a x-3y=2): representan la misma recta, así que hay infinitas soluciones.",
    "falencia": "Determinar un parámetro que hace indeterminado (rectas coincidentes) un sistema 2x2."
  },
  {
    "id": "s01_p27",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Calcular la distancia entre la recta  3x - 4y = 12  y el punto (2,1).",
    "opciones": [
      {
        "id": "a",
        "texto": "2."
      },
      {
        "id": "b",
        "texto": "10."
      },
      {
        "id": "c",
        "texto": "0.4."
      },
      {
        "id": "d",
        "texto": "5."
      }
    ],
    "correcta": "a",
    "explicacion": "Forma general: 3x-4y-12=0, con A=3, B=-4, C=-12. d = |3(2)-4(1)-12| / sqrt(3²+(-4)²) = |-10|/5 = 2.",
    "falencia": "Cálculo de la distancia de un punto a una recta con la fórmula d=|Ax+By+C|/sqrt(A²+B²)."
  },
  {
    "id": "s01_p28",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Calcular la distancia entre la recta  x + y = 0  y el punto (3,3).",
    "opciones": [
      {
        "id": "a",
        "texto": "3·sqrt(2) (≈4.24)."
      },
      {
        "id": "b",
        "texto": "6."
      },
      {
        "id": "c",
        "texto": "3."
      },
      {
        "id": "d",
        "texto": "sqrt(2)."
      }
    ],
    "correcta": "a",
    "explicacion": "Forma general: x+y-0=0, con A=1, B=1, C=0. d = |1(3)+1(3)+0| / sqrt(1²+1²) = 6/sqrt(2) = 3·sqrt(2).",
    "falencia": "Cálculo de la distancia de un punto a una recta con la fórmula d=|Ax+By+C|/sqrt(A²+B²)."
  },
  {
    "id": "s01_p29",
    "semanaId": 1,
    "tipo": "teoria",
    "pregunta": "La fórmula de distancia de un punto a una recta, d = |Ax1+By1+C|/sqrt(A²+B²), se fundamenta geométricamente en:",
    "opciones": [
      {
        "id": "a",
        "texto": "El teorema de Pitágoras aplicado a un triángulo cualquiera."
      },
      {
        "id": "b",
        "texto": "La proyección del vector desde un punto de la recta hasta P sobre la dirección normal a la recta."
      },
      {
        "id": "c",
        "texto": "La ley de voltajes de Kirchhoff."
      },
      {
        "id": "d",
        "texto": "El algoritmo de Gauss-Jordan."
      }
    ],
    "correcta": "b",
    "explicacion": "La distancia mínima de un punto a una recta es la longitud de la proyección de un vector hacia ese punto sobre la dirección normal (perpendicular) de la recta, lo que da lugar exactamente a esa fórmula.",
    "falencia": "Fundamento geométrico de la fórmula de distancia punto-recta."
  },
  {
    "id": "s01_p30",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Resolver por eliminación el sistema  x + 2y = 7,  x - y = 1.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x,y) = (3,2)."
      },
      {
        "id": "b",
        "texto": "(x,y) = (2,3)."
      },
      {
        "id": "c",
        "texto": "(x,y) = (5,1)."
      },
      {
        "id": "d",
        "texto": "(x,y) = (1,3)."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación x=1+y. Sustituyendo en la primera: 1+y+2y=7 => 3y=6 => y=2, y entonces x=3. Verificación: 3-2=1 ✓.",
    "falencia": "Resolución de sistemas 2x2 por sustitución/eliminación."
  },
  {
    "id": "s01_p31",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Resolver por sustitución el sistema  4x - y = 10,  x + y = 5.",
    "opciones": [
      {
        "id": "a",
        "texto": "(x,y) = (3,2)."
      },
      {
        "id": "b",
        "texto": "(x,y) = (2,3)."
      },
      {
        "id": "c",
        "texto": "(x,y) = (4,1)."
      },
      {
        "id": "d",
        "texto": "(x,y) = (1,4)."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación y=5-x. Sustituyendo en la primera: 4x-(5-x)=10 => 5x-5=10 => x=3, y entonces y=2. Verificación: 12-2=10 ✓.",
    "falencia": "Resolución de sistemas 2x2 por sustitución/eliminación."
  },
  {
    "id": "s01_p32",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Clasificar el sistema  5x - 2y = 8,  -10x + 4y = -16.",
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
    "correcta": "c",
    "explicacion": "La segunda ecuación es exactamente -2 veces la primera (-2(5x-2y)=-10x+4y y -2(8)=-16): representan la misma recta, infinitas soluciones.",
    "falencia": "Clasificación de sistemas 2x2 por proporcionalidad de coeficientes."
  },
  {
    "id": "s01_p33",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Clasificar el sistema  3x + y = 4,  6x + 2y = 9.",
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
    "explicacion": "Los coeficientes son proporcionales (3/6 = 1/2), pero los términos independientes no lo están (4/9 ≠ 1/2): rectas paralelas distintas, sistema inconsistente.",
    "falencia": "Clasificación de sistemas 2x2 por proporcionalidad de coeficientes."
  },
  {
    "id": "s01_p34",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Clasificar (sin resolver) el sistema  x - y = 3,  x + y = 7.",
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
    "correcta": "b",
    "explicacion": "Las pendientes son distintas (1 y -1): las rectas se cortan en un único punto.",
    "falencia": "Clasificación de sistemas 2x2 por comparación de pendientes."
  },
  {
    "id": "s01_p35",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  x + y = 10,  2x - y = 5, ¿la tupla (x,y) = (5,5) es solución?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, satisface ambas ecuaciones."
      },
      {
        "id": "b",
        "texto": "No, falla en la primera ecuación."
      },
      {
        "id": "c",
        "texto": "No, falla en la segunda ecuación."
      },
      {
        "id": "d",
        "texto": "No, falla en ambas ecuaciones."
      }
    ],
    "correcta": "a",
    "explicacion": "Ecuación 1: 5+5=10 ✓. Ecuación 2: 2(5)-5=5 ✓. La tupla satisface ambas ecuaciones.",
    "falencia": "Verificar si una tupla dada es solución de un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p36",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dado el sistema  x + y = 10,  2x - y = 5, ¿la tupla (x,y) = (3,7) es solución?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, satisface ambas ecuaciones."
      },
      {
        "id": "b",
        "texto": "No, falla en la primera ecuación."
      },
      {
        "id": "c",
        "texto": "No, falla en la segunda ecuación."
      },
      {
        "id": "d",
        "texto": "No, falla en ambas ecuaciones."
      }
    ],
    "correcta": "c",
    "explicacion": "Ecuación 1: 3+7=10 ✓. Ecuación 2: 2(3)-7=-1, debería dar 5: no se cumple. Falla solo en la segunda ecuación.",
    "falencia": "Verificar si una tupla dada es solución de un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p37",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Para el sistema  2x + ky = 6,  x + 3y = 3, ¿qué valor de k produce infinitas soluciones?",
    "opciones": [
      {
        "id": "a",
        "texto": "k = 6."
      },
      {
        "id": "b",
        "texto": "k = 3."
      },
      {
        "id": "c",
        "texto": "k = 2."
      },
      {
        "id": "d",
        "texto": "k = -6."
      }
    ],
    "correcta": "a",
    "explicacion": "Con k=6, la segunda ecuación multiplicada por 2 da 2x+6y=6, idéntica a la primera: misma recta, infinitas soluciones.",
    "falencia": "Determinar un parámetro que hace indeterminado un sistema 2x2."
  },
  {
    "id": "s01_p38",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Para el sistema  x + 2y = 5,  3x + ky = 10, ¿qué valor de k lo hace inconsistente?",
    "opciones": [
      {
        "id": "a",
        "texto": "k = 6."
      },
      {
        "id": "b",
        "texto": "k = 3."
      },
      {
        "id": "c",
        "texto": "k = 1/6."
      },
      {
        "id": "d",
        "texto": "Ningún valor de k lo hace inconsistente."
      }
    ],
    "correcta": "a",
    "explicacion": "Para que las rectas sean paralelas se necesita 1/3 = 2/k, es decir k=6. Con k=6 los términos independientes no guardan esa misma proporción (5/10=1/2 ≠ 1/3): rectas paralelas distintas, inconsistente.",
    "falencia": "Determinar un parámetro que hace inconsistente un sistema 2x2."
  },
  {
    "id": "s01_p39",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Dos fuerzas F1 y F2 en un nodo satisfacen  3F1 - 2F2 = 12,  F1 + F2 = 9  (en newtons). ¿Cuál es el valor de F1?",
    "opciones": [
      {
        "id": "a",
        "texto": "F1 = 6 N."
      },
      {
        "id": "b",
        "texto": "F1 = 3 N."
      },
      {
        "id": "c",
        "texto": "F1 = 9 N."
      },
      {
        "id": "d",
        "texto": "F1 = 12 N."
      }
    ],
    "correcta": "a",
    "explicacion": "De la segunda ecuación F1=9-F2. Sustituyendo en la primera: 3(9-F2)-2F2=12 => 27-5F2=12 => F2=3, y entonces F1=6 N.",
    "falencia": "Traducir y resolver un sistema de ecuaciones a partir de un equilibrio de fuerzas."
  },
  {
    "id": "s01_p40",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Se combinan x kg de una aleación al 30% de cobre con y kg de una aleación al 60% de cobre para obtener 50 kg de una aleación al 42% de cobre. ¿Cuántos kg de cada una se necesitan?",
    "opciones": [
      {
        "id": "a",
        "texto": "x = 30 kg, y = 20 kg."
      },
      {
        "id": "b",
        "texto": "x = 20 kg, y = 30 kg."
      },
      {
        "id": "c",
        "texto": "x = 25 kg, y = 25 kg."
      },
      {
        "id": "d",
        "texto": "x = 35 kg, y = 15 kg."
      }
    ],
    "correcta": "a",
    "explicacion": "El sistema es x+y=50 (masa total) y 0.3x+0.6y=0.42(50)=21 (balance de cobre). De la primera, x=50-y; sustituyendo: 0.3(50-y)+0.6y=21 => 0.3y=6 => y=20, x=30.",
    "falencia": "Traducir un problema de mezclas/aleaciones a un sistema de ecuaciones lineales."
  },
  {
    "id": "s01_p41",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Al eliminar una variable de un sistema 2x2 se llega a la ecuación 0 = 0. ¿Qué significa esto?",
    "opciones": [
      {
        "id": "a",
        "texto": "El sistema es inconsistente."
      },
      {
        "id": "b",
        "texto": "Las dos ecuaciones representan la misma recta: hay infinitas soluciones."
      },
      {
        "id": "c",
        "texto": "El sistema tiene solución única."
      },
      {
        "id": "d",
        "texto": "No se puede determinar nada."
      }
    ],
    "correcta": "b",
    "explicacion": "0=0 no es una contradicción: significa que la segunda ecuación no aportó información nueva (es múltiplo de la primera), así que ambas representan la misma recta y hay infinitas soluciones.",
    "falencia": "Interpretar el resultado 0=0 al reducir un sistema."
  },
  {
    "id": "s01_p42",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "Al eliminar una variable de un sistema 2x2 se llega a la ecuación 0 = 5. ¿Qué significa esto?",
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
        "texto": "El sistema es inconsistente: las rectas son paralelas distintas."
      },
      {
        "id": "d",
        "texto": "El sistema es homogéneo."
      }
    ],
    "correcta": "c",
    "explicacion": "0=5 es una contradicción (falsa para cualquier valor de las variables): el sistema no tiene ninguna solución, las rectas son paralelas distintas.",
    "falencia": "Interpretar una contradicción (0=c, c≠0) al reducir un sistema."
  },
  {
    "id": "s01_p43",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "La solución de un sistema de ecuaciones es el punto (2,-1). Calcular la distancia de ese punto a la recta 3x - 4y = 5.",
    "opciones": [
      {
        "id": "a",
        "texto": "1."
      },
      {
        "id": "b",
        "texto": "5."
      },
      {
        "id": "c",
        "texto": "0.2."
      },
      {
        "id": "d",
        "texto": "15."
      }
    ],
    "correcta": "a",
    "explicacion": "Forma general: 3x-4y-5=0, con A=3, B=-4, C=-5. d = |3(2)-4(-1)-5| / sqrt(3²+(-4)²) = |6+4-5|/5 = 5/5 = 1.",
    "falencia": "Combinar la solución de un sistema con la fórmula de distancia punto-recta."
  },
  {
    "id": "s01_p44",
    "semanaId": 1,
    "tipo": "ejercicio",
    "pregunta": "En un sistema 2x2, las dos ecuaciones tienen la misma pendiente pero distinto intercepto. ¿Cuántas soluciones tiene el sistema?",
    "opciones": [
      {
        "id": "a",
        "texto": "Ninguna."
      },
      {
        "id": "b",
        "texto": "Una."
      },
      {
        "id": "c",
        "texto": "Infinitas."
      },
      {
        "id": "d",
        "texto": "Depende de los coeficientes."
      }
    ],
    "correcta": "a",
    "explicacion": "Misma pendiente y distinto intercepto significa rectas paralelas distintas: nunca se cruzan, el sistema no tiene solución.",
    "falencia": "Interpretación geométrica de rectas paralelas distintas."
  }
];
