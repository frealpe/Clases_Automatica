const PREGUNTAS = [
  {
    "id": "prog04_p1",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Cuál es la diferencia entre ámbito (scope) y tiempo de vida (storage duration) de una variable?",
    "opciones": [
      {
        "id": "a",
        "texto": "Son sinónimos: siempre coinciden exactamente para cualquier variable en C."
      },
      {
        "id": "b",
        "texto": "El ámbito es dónde es visible el nombre de la variable; el tiempo de vida es cuánto tiempo existe en memoria. Normalmente coinciden en una variable local, pero static los separa."
      },
      {
        "id": "c",
        "texto": "El ámbito se refiere solo a variables globales; el tiempo de vida solo a variables locales."
      },
      {
        "id": "d",
        "texto": "El tiempo de vida determina el tipo de dato de la variable."
      }
    ],
    "correcta": "b",
    "explicacion": "Ámbito y tiempo de vida son conceptos distintos que suelen coincidir en una variable local ordinaria (nace y muere con la función), pero static permite que el tiempo de vida sea el de todo el programa sin ampliar el ámbito.",
    "falencia": "Distinguir ámbito de tiempo de vida."
  },
  {
    "id": "prog04_p2",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "Una variable local declarada con static:",
    "opciones": [
      {
        "id": "a",
        "texto": "Pasa a ser visible desde cualquier función del programa, igual que una global."
      },
      {
        "id": "b",
        "texto": "Conserva su ámbito normal (solo visible dentro de su función), pero su tiempo de vida pasa a ser el de todo el programa, conservando su valor entre llamadas."
      },
      {
        "id": "c",
        "texto": "Se reinicia a su valor inicial en cada llamada, igual que una variable local ordinaria."
      },
      {
        "id": "d",
        "texto": "Solo puede usarse dentro de funciones void."
      }
    ],
    "correcta": "b",
    "explicacion": "static cambia el tiempo de vida (a todo el programa) pero no el ámbito: la variable sigue siendo visible únicamente dentro de la función donde se declaró.",
    "falencia": "Qué cambia y qué no cambia al declarar una variable local como static."
  },
  {
    "id": "prog04_p3",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int contadorLlamadas(void){ static int veces=0; veces++; return veces; }  Se llama tres veces seguidas desde main, imprimiendo cada resultado. ¿Qué se imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "1, 2, 3"
      },
      {
        "id": "b",
        "texto": "1, 1, 1"
      },
      {
        "id": "c",
        "texto": "0, 1, 2"
      },
      {
        "id": "d",
        "texto": "3, 3, 3"
      }
    ],
    "correcta": "a",
    "explicacion": "veces se inicializa en 0 solo la primera vez; cada llamada posterior parte del valor que dejó la anterior, así que el conteo se acumula: 1, 2, 3.",
    "falencia": "Trazar una variable estática local que actúa como contador entre llamadas."
  },
  {
    "id": "prog04_p4",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int f(void){ int c=0; c++; return c; }  (SIN static). Se llama tres veces seguidas desde main, imprimiendo cada resultado. ¿Qué se imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "1, 1, 1"
      },
      {
        "id": "b",
        "texto": "1, 2, 3"
      },
      {
        "id": "c",
        "texto": "0, 0, 0"
      },
      {
        "id": "d",
        "texto": "Error de compilación."
      }
    ],
    "correcta": "a",
    "explicacion": "Sin static, c es una variable local ordinaria: se crea y se inicializa a 0 en cada llamada, se incrementa a 1, y se destruye al terminar. Cada llamada es independiente, así que siempre imprime 1.",
    "falencia": "Contrastar una variable local ordinaria (sin static) con una estática."
  },
  {
    "id": "prog04_p5",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿En qué se parecen una variable estática local y una variable global?",
    "opciones": [
      {
        "id": "a",
        "texto": "En nada: son conceptos completamente distintos."
      },
      {
        "id": "b",
        "texto": "Comparten el mismo tiempo de vida (todo el programa), aunque difieren en ámbito: la global es visible desde varias funciones y la estática local solo dentro de la suya."
      },
      {
        "id": "c",
        "texto": "Ambas son visibles desde cualquier función del programa."
      },
      {
        "id": "d",
        "texto": "Ambas se destruyen al terminar la función donde se usan."
      }
    ],
    "correcta": "b",
    "explicacion": "El punto en común es el tiempo de vida (todo el programa); la diferencia clave es el ámbito, más restringido en la estática local.",
    "falencia": "Comparar variable estática local con variable global."
  },
  {
    "id": "prog04_p6",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Cuándo conviene preferir una variable estática local sobre una variable global para guardar un contador?",
    "opciones": [
      {
        "id": "a",
        "texto": "Nunca; una variable global siempre es la mejor opción para contar algo."
      },
      {
        "id": "b",
        "texto": "Cuando el estado (el contador) le pertenece conceptualmente a una sola función y no debe poder ser leído ni modificado por el resto del programa."
      },
      {
        "id": "c",
        "texto": "Solo cuando la función es void."
      },
      {
        "id": "d",
        "texto": "Solo si el programa no tiene la palabra clave static disponible."
      }
    ],
    "correcta": "b",
    "explicacion": "La variable estática local mantiene el mismo tiempo de vida que una global, pero protege el estado de accesos accidentales desde otras funciones, al restringir su ámbito.",
    "falencia": "Criterio de diseño para elegir static local en vez de global."
  },
  {
    "id": "prog04_p7",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int main(void){ int x=1; { int x=2; printf(\"%d \", x); } printf(\"%d\", x); return 0; }  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "2 1"
      },
      {
        "id": "b",
        "texto": "1 1"
      },
      {
        "id": "c",
        "texto": "2 2"
      },
      {
        "id": "d",
        "texto": "Error de compilación por redeclarar x."
      }
    ],
    "correcta": "a",
    "explicacion": "La x del bloque interno sombrea (oculta) a la externa mientras dura el bloque; al salir del bloque esa x interna desaparece y el nombre vuelve a referirse a la x externa, que sigue en 1.",
    "falencia": "Trazar sombreado (shadowing) de variables en bloques anidados."
  },
  {
    "id": "prog04_p8",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "En C, ¿qué delimita un bloque?",
    "opciones": [
      {
        "id": "a",
        "texto": "Un par de paréntesis ( )."
      },
      {
        "id": "b",
        "texto": "Un par de llaves { }: el cuerpo de una función, de un if, de un for, o incluso un bloque suelto."
      },
      {
        "id": "c",
        "texto": "Solo la palabra clave static."
      },
      {
        "id": "d",
        "texto": "El punto y coma al final de cada instrucción."
      }
    ],
    "correcta": "b",
    "explicacion": "Cualquier { } delimita un bloque; una variable declarada dentro es local a ese bloque y su ámbito termina en la llave de cierre correspondiente.",
    "falencia": "Qué constituye un bloque en C."
  },
  {
    "id": "prog04_p9",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Cuándo desaparece una variable declarada dentro de un bloque interno (por ejemplo, dentro de las llaves de un if)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Nunca; permanece visible el resto del programa."
      },
      {
        "id": "b",
        "texto": "Al llegar a la llave de cierre } de ese bloque."
      },
      {
        "id": "c",
        "texto": "Solo cuando termina main."
      },
      {
        "id": "d",
        "texto": "Solo si se declaró como static."
      }
    ],
    "correcta": "b",
    "explicacion": "El ámbito de una variable de bloque termina en la llave de cierre correspondiente a la llave de apertura donde se declaró.",
    "falencia": "Ámbito de una variable declarada dentro de un bloque anidado."
  },
  {
    "id": "prog04_p10",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Qué es una función recursiva?",
    "opciones": [
      {
        "id": "a",
        "texto": "Una función que solo puede llamarse una vez en todo el programa."
      },
      {
        "id": "b",
        "texto": "Una función que, en su propio cuerpo, se llama a sí misma (directa o indirectamente)."
      },
      {
        "id": "c",
        "texto": "Una función que no tiene parámetros."
      },
      {
        "id": "d",
        "texto": "Una función declarada con static."
      }
    ],
    "correcta": "b",
    "explicacion": "La recursión ocurre cuando una función se invoca a sí misma, ya sea directamente o a través de otra función intermedia.",
    "falencia": "Definición de función recursiva."
  },
  {
    "id": "prog04_p11",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "Toda función recursiva correcta necesita:",
    "opciones": [
      {
        "id": "a",
        "texto": "Solo un caso recursivo; el caso base es opcional."
      },
      {
        "id": "b",
        "texto": "Un caso base que se resuelve sin volver a llamarse, y uno o más casos recursivos que reducen el problema y se apoyan en la llamada más pequeña."
      },
      {
        "id": "c",
        "texto": "Una variable global que cuente las llamadas realizadas."
      },
      {
        "id": "d",
        "texto": "Un ciclo for dentro de su cuerpo."
      }
    ],
    "correcta": "b",
    "explicacion": "El caso base detiene la recursión; el caso recursivo reduce el problema a una versión más pequeña y usa el resultado de esa llamada para construir su propio resultado.",
    "falencia": "Estructura obligatoria de una función recursiva correcta."
  },
  {
    "id": "prog04_p12",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int factorial(int n){ if(n<=1) return 1; return n*factorial(n-1); }  ¿Qué retorna factorial(4)?",
    "opciones": [
      {
        "id": "a",
        "texto": "24"
      },
      {
        "id": "b",
        "texto": "10"
      },
      {
        "id": "c",
        "texto": "4"
      },
      {
        "id": "d",
        "texto": "12"
      }
    ],
    "correcta": "a",
    "explicacion": "factorial(4) = 4 * factorial(3) = 4 * 3 * factorial(2) = 4*3*2*factorial(1) = 4*3*2*1 = 24.",
    "falencia": "Trazar la ejecución de una función factorial recursiva."
  },
  {
    "id": "prog04_p13",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int factorial(int n){ if(n<=1) return 1; return n*factorial(n-1); }  ¿Cuál es el caso base de esta función?",
    "opciones": [
      {
        "id": "a",
        "texto": "return n*factorial(n-1);"
      },
      {
        "id": "b",
        "texto": "if(n<=1) return 1;"
      },
      {
        "id": "c",
        "texto": "int factorial(int n)"
      },
      {
        "id": "d",
        "texto": "No tiene caso base."
      }
    ],
    "correcta": "b",
    "explicacion": "El caso base es la condición que se resuelve directamente, sin generar una nueva llamada: cuando n<=1, la función retorna 1 de inmediato.",
    "falencia": "Identificar el caso base dentro del código de una función recursiva."
  },
  {
    "id": "prog04_p14",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Qué ocurre si una función recursiva no tiene un caso base alcanzable para alguna entrada?",
    "opciones": [
      {
        "id": "a",
        "texto": "El compilador detecta el error y rechaza el programa antes de ejecutarlo."
      },
      {
        "id": "b",
        "texto": "La función se llama a sí misma indefinidamente, agotando la memoria de la pila de llamadas (stack overflow) en tiempo de ejecución."
      },
      {
        "id": "c",
        "texto": "C detiene automáticamente la recursión después de 100 llamadas."
      },
      {
        "id": "d",
        "texto": "La función retorna 0 automáticamente."
      }
    ],
    "correcta": "b",
    "explicacion": "El compilador no puede saber en general si el caso base se alcanzará; sin él, las llamadas nunca terminan y la pila de llamadas crece hasta agotar la memoria disponible, un error de tiempo de ejecución.",
    "falencia": "Consecuencia de una función recursiva sin caso base alcanzable."
  },
  {
    "id": "prog04_p15",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Qué es la pila de llamadas (call stack)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Un arreglo que el programador debe declarar manualmente para usar recursión."
      },
      {
        "id": "b",
        "texto": "La estructura que usa el programa en ejecución para llevar el control de las funciones activas: cada llamada apila un marco con sus parámetros y variables locales, que se retira al terminar."
      },
      {
        "id": "c",
        "texto": "Un tipo de variable global usada solo en programas recursivos."
      },
      {
        "id": "d",
        "texto": "La lista de funciones definidas en el archivo fuente."
      }
    ],
    "correcta": "b",
    "explicacion": "La pila de llamadas gestiona automáticamente las funciones activas: cada llamada agrega un marco (parámetros y variables locales) que se retira cuando esa llamada termina.",
    "falencia": "Definición de la pila de llamadas."
  },
  {
    "id": "prog04_p16",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "En factorial(5), mientras las llamadas están pendientes de terminar, ¿qué ocurre con los parámetros n de factorial(5), factorial(4), ..., factorial(1)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Todos comparten la misma variable n, así que su valor final es el mismo en todas."
      },
      {
        "id": "b",
        "texto": "Cada llamada activa tiene su propio marco en la pila, con su propia copia de n, coexistiendo mientras las llamadas están pendientes."
      },
      {
        "id": "c",
        "texto": "Solo existe un n: el de la primera llamada; las demás lo sobrescriben."
      },
      {
        "id": "d",
        "texto": "n se convierte automáticamente en una variable global durante la recursión."
      }
    ],
    "correcta": "b",
    "explicacion": "Cada llamada recursiva activa tiene su propio marco independiente en la pila, con su propia copia de los parámetros; no se comparten entre llamadas.",
    "falencia": "Coexistencia de marcos independientes en la pila durante una recursión activa."
  },
  {
    "id": "prog04_p17",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int fibonacciRec(int n){ if(n==0) return 0; if(n==1) return 1; return fibonacciRec(n-1)+fibonacciRec(n-2); }  ¿Qué retorna fibonacciRec(5)?",
    "opciones": [
      {
        "id": "a",
        "texto": "5"
      },
      {
        "id": "b",
        "texto": "8"
      },
      {
        "id": "c",
        "texto": "3"
      },
      {
        "id": "d",
        "texto": "13"
      }
    ],
    "correcta": "a",
    "explicacion": "La secuencia de Fibonacci es 0,1,1,2,3,5,8,... para n=0,1,2,3,4,5; fibonacciRec(5) retorna el sexto término (índice 5): 5.",
    "falencia": "Trazar el resultado de una función Fibonacci recursiva."
  },
  {
    "id": "prog04_p18",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "Comparando fibonacciRec (recursiva) con fibonacciIter (con un solo ciclo for), ¿qué diferencia clave existe en su consumo de recursos?",
    "opciones": [
      {
        "id": "a",
        "texto": "No hay ninguna diferencia; ambas usan exactamente la misma cantidad de memoria y tiempo."
      },
      {
        "id": "b",
        "texto": "fibonacciRec genera un número de llamadas que crece exponencialmente con n; fibonacciIter usa un ciclo con memoria constante, generalmente más eficiente."
      },
      {
        "id": "c",
        "texto": "fibonacciIter es siempre incorrecta porque no usa recursión."
      },
      {
        "id": "d",
        "texto": "fibonacciRec nunca podría implementarse en C."
      }
    ],
    "correcta": "b",
    "explicacion": "Cada llamada no base de fibonacciRec genera dos llamadas nuevas, así que el número total de llamadas crece exponencialmente; fibonacciIter recorre un ciclo simple con un puñado de variables, mucho más eficiente en tiempo y memoria.",
    "falencia": "Comparar el costo en tiempo/memoria de una solución recursiva frente a una iterativa."
  },
  {
    "id": "prog04_p19",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Cuándo suele preferirse una solución recursiva sobre una iterativa?",
    "opciones": [
      {
        "id": "a",
        "texto": "Siempre, porque la recursión siempre es más rápida que un ciclo."
      },
      {
        "id": "b",
        "texto": "Cuando el problema tiene una estructura naturalmente recursiva y la claridad del código, al reflejar directamente la definición del problema, importa más que el costo adicional de las llamadas."
      },
      {
        "id": "c",
        "texto": "Nunca; la iteración siempre debe preferirse en C."
      },
      {
        "id": "d",
        "texto": "Solo cuando el problema no tiene caso base."
      }
    ],
    "correcta": "b",
    "explicacion": "La recursión suele elegirse por claridad cuando el problema se define naturalmente en términos de sí mismo, aceptando el costo adicional de las llamadas frente a una versión iterativa.",
    "falencia": "Criterio de diseño para preferir recursión sobre iteración."
  },
  {
    "id": "prog04_p20",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int sumaHasta(int n){ if(n==1) return 1; return n+sumaHasta(n-1); }  ¿Qué retorna sumaHasta(4)?",
    "opciones": [
      {
        "id": "a",
        "texto": "10"
      },
      {
        "id": "b",
        "texto": "4"
      },
      {
        "id": "c",
        "texto": "24"
      },
      {
        "id": "d",
        "texto": "6"
      }
    ],
    "correcta": "a",
    "explicacion": "sumaHasta(4) = 4+sumaHasta(3) = 4+3+sumaHasta(2) = 4+3+2+sumaHasta(1) = 4+3+2+1 = 10.",
    "falencia": "Trazar una función recursiva que suma 1+2+...+n."
  },
  {
    "id": "prog04_p21",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int potencia(int base,int exp){ if(exp==0) return 1; return base*potencia(base,exp-1); }  ¿Qué retorna potencia(3,3)?",
    "opciones": [
      {
        "id": "a",
        "texto": "27"
      },
      {
        "id": "b",
        "texto": "9"
      },
      {
        "id": "c",
        "texto": "6"
      },
      {
        "id": "d",
        "texto": "3"
      }
    ],
    "correcta": "a",
    "explicacion": "potencia(3,3) = 3*potencia(3,2) = 3*3*potencia(3,1) = 3*3*3*potencia(3,0) = 3*3*3*1 = 27.",
    "falencia": "Trazar una función recursiva de potenciación."
  },
  {
    "id": "prog04_p22",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "int g(void){ static int c=0; c=c+2; return c; }  Se llama tres veces seguidas desde main, imprimiendo cada resultado. ¿Qué se imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "2, 4, 6"
      },
      {
        "id": "b",
        "texto": "2, 2, 2"
      },
      {
        "id": "c",
        "texto": "0, 2, 4"
      },
      {
        "id": "d",
        "texto": "2, 4, 8"
      }
    ],
    "correcta": "a",
    "explicacion": "c se inicializa en 0 solo la primera vez; cada llamada suma 2 al valor que dejó la anterior: 0+2=2, 2+2=4, 4+2=6.",
    "falencia": "Trazar una variable estática local modificada con una operación distinta a un simple incremento."
  },
  {
    "id": "prog04_p23",
    "semanaId": 204,
    "tipo": "teoria",
    "pregunta": "¿Por qué combinar static con nombres repetidos entre bloques anidados es una fuente común de errores?",
    "opciones": [
      {
        "id": "a",
        "texto": "Porque C no permite usar static dentro de bloques anidados."
      },
      {
        "id": "b",
        "texto": "Porque puede no quedar claro, al leer el código, qué ámbito y qué tiempo de vida tiene realmente cada variable, generando confusión sobre cuál valor persiste y cuál se reinicia."
      },
      {
        "id": "c",
        "texto": "Porque el compilador siempre rechaza esas combinaciones con un error."
      },
      {
        "id": "d",
        "texto": "Porque static solo funciona con variables de tipo char."
      }
    ],
    "correcta": "b",
    "explicacion": "El riesgo es de legibilidad y diseño: mezclar sombreado con variables estáticas dificulta predecir qué variable se está leyendo o modificando y si su valor persiste entre llamadas.",
    "falencia": "Riesgo de diseño al combinar static con sombreado de variables."
  },
  {
    "id": "prog04_p24",
    "semanaId": 204,
    "tipo": "ejercicio",
    "pregunta": "void f(int x){ printf(\"%d \", x); if(x>0) f(x-1); }  Llamada: f(3);  ¿Qué imprime en total?",
    "opciones": [
      {
        "id": "a",
        "texto": "3 2 1 0"
      },
      {
        "id": "b",
        "texto": "3 2 1"
      },
      {
        "id": "c",
        "texto": "0 1 2 3"
      },
      {
        "id": "d",
        "texto": "Recursión infinita, no termina nunca."
      }
    ],
    "correcta": "a",
    "explicacion": "f(3) imprime 3 y llama f(2); f(2) imprime 2 y llama f(1); f(1) imprime 1 y llama f(0); f(0) imprime 0 y, como x>0 es falso, no vuelve a llamarse: la salida completa es 3 2 1 0.",
    "falencia": "Trazar una función recursiva void con condición de parada implícita en el parámetro."
  }
];
