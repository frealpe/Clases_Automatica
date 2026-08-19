const PREGUNTAS = [
  {
    "id": "prog03_p1",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "¿Qué es una función en C?",
    "opciones": [
      {
        "id": "a",
        "texto": "Una variable especial que solo existe dentro de main."
      },
      {
        "id": "b",
        "texto": "Un bloque de código con nombre propio, reutilizable, que puede recibir parámetros y devolver un valor."
      },
      {
        "id": "c",
        "texto": "Un tipo de dato primitivo."
      },
      {
        "id": "d",
        "texto": "Un comentario dentro del código."
      }
    ],
    "correcta": "b",
    "explicacion": "Una función agrupa instrucciones bajo un nombre, se puede llamar (invocar) tantas veces como se necesite, y opcionalmente recibe parámetros y devuelve un valor.",
    "falencia": "Definición de función."
  },
  {
    "id": "prog03_p2",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "¿Qué es el \"diseño descendente\" (top-down)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Escribir todo el programa dentro de una sola función."
      },
      {
        "id": "b",
        "texto": "Dividir un problema grande en subproblemas más pequeños y manejables, resolviendo cada uno con su propia función."
      },
      {
        "id": "c",
        "texto": "Ordenar las funciones del archivo de la más grande a la más pequeña."
      },
      {
        "id": "d",
        "texto": "Un estilo particular de indentación del código."
      }
    ],
    "correcta": "b",
    "explicacion": "El diseño descendente parte del problema completo y lo va descomponiendo en partes más simples, cada una resuelta por una función, hasta que cada pieza es fácil de implementar.",
    "falencia": "Concepto de diseño descendente (top-down) y modularización."
  },
  {
    "id": "prog03_p3",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "¿Cuál de las siguientes NO es una ventaja real de modularizar un programa en funciones?",
    "opciones": [
      {
        "id": "a",
        "texto": "Reutilización de código."
      },
      {
        "id": "b",
        "texto": "Mejor legibilidad del programa."
      },
      {
        "id": "c",
        "texto": "El programa ocupa automáticamente menos espacio en disco por el simple hecho de usar funciones."
      },
      {
        "id": "d",
        "texto": "Facilita probar cada parte del programa por separado."
      }
    ],
    "correcta": "c",
    "explicacion": "Modularizar no reduce automáticamente el tamaño en disco del programa; sus ventajas reales son de organización, reutilización, legibilidad y facilidad de prueba/mantenimiento.",
    "falencia": "Distinguir las ventajas reales de modularizar de afirmaciones falsas."
  },
  {
    "id": "prog03_p4",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "El prototipo de una función:",
    "opciones": [
      {
        "id": "a",
        "texto": "Incluye el cuerpo completo de la función."
      },
      {
        "id": "b",
        "texto": "Anuncia al compilador el nombre, tipo de retorno y tipos de los parámetros de la función, sin incluir su cuerpo."
      },
      {
        "id": "c",
        "texto": "Solo es necesario en funciones void."
      },
      {
        "id": "d",
        "texto": "Debe escribirse siempre dentro de main."
      }
    ],
    "correcta": "b",
    "explicacion": "El prototipo es solo la \"firma\" de la función (tipo de retorno, nombre, tipos de parámetros) terminada en punto y coma, sin el cuerpo; le permite al compilador reconocer llamadas a la función antes de ver su definición completa.",
    "falencia": "Qué información contiene un prototipo de función."
  },
  {
    "id": "prog03_p5",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "¿Cuál es el prototipo correcto para una función que recibe un double (radio) y retorna un double (área)?",
    "opciones": [
      {
        "id": "a",
        "texto": "double areaCirculo(double radio);"
      },
      {
        "id": "b",
        "texto": "void areaCirculo(double radio);"
      },
      {
        "id": "c",
        "texto": "areaCirculo(double radio) double;"
      },
      {
        "id": "d",
        "texto": "double areaCirculo();"
      }
    ],
    "correcta": "a",
    "explicacion": "El prototipo debe indicar el tipo de retorno (double), el nombre (areaCirculo) y el tipo de cada parámetro (double radio), terminado en punto y coma.",
    "falencia": "Escribir el prototipo de una función con parámetro y valor de retorno."
  },
  {
    "id": "prog03_p6",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "Una función declarada con tipo de retorno void:",
    "opciones": [
      {
        "id": "a",
        "texto": "Siempre debe llevar return valor; al final de su cuerpo."
      },
      {
        "id": "b",
        "texto": "No devuelve ningún valor; se usa para tareas como imprimir, donde lo que importa es el efecto, no un resultado calculado."
      },
      {
        "id": "c",
        "texto": "Solo puede recibir un parámetro como máximo."
      },
      {
        "id": "d",
        "texto": "No puede recibir ningún parámetro."
      }
    ],
    "correcta": "b",
    "explicacion": "void indica ausencia de valor de retorno; la función puede seguir recibiendo parámetros normalmente, solo que no calcula un resultado para devolver con return.",
    "falencia": "Qué significa que una función sea void."
  },
  {
    "id": "prog03_p7",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "double areaCirculo(double radio){ return 3.14159 * radio * radio; }  Llamada: areaCirculo(2.0). ¿Cuál es el resultado (aproximado)?",
    "opciones": [
      {
        "id": "a",
        "texto": "12.57 (aprox.)"
      },
      {
        "id": "b",
        "texto": "6.28"
      },
      {
        "id": "c",
        "texto": "4.00"
      },
      {
        "id": "d",
        "texto": "25.13"
      }
    ],
    "correcta": "a",
    "explicacion": "3.14159 × 2.0 × 2.0 = 3.14159 × 4 = 12.56636, aproximadamente 12.57.",
    "falencia": "Evaluar el resultado de una función con retorno double."
  },
  {
    "id": "prog03_p8",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "int maximo(int a,int b,int c){ int m=a; if(b>m) m=b; if(c>m) m=c; return m; }  Llamada: maximo(7,15,3). ¿Qué retorna?",
    "opciones": [
      {
        "id": "a",
        "texto": "15"
      },
      {
        "id": "b",
        "texto": "7"
      },
      {
        "id": "c",
        "texto": "3"
      },
      {
        "id": "d",
        "texto": "25"
      }
    ],
    "correcta": "a",
    "explicacion": "m inicia en 7 (a). Como b=15>7, m pasa a 15. Como c=3 no es mayor que 15, m se queda en 15. Retorna 15.",
    "falencia": "Trazar una función que calcula el máximo de tres valores."
  },
  {
    "id": "prog03_p9",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "int esPar(int n){ return (n%2==0) ? 1 : 0; }  ¿Qué retorna esPar(7)?",
    "opciones": [
      {
        "id": "a",
        "texto": "1"
      },
      {
        "id": "b",
        "texto": "0"
      },
      {
        "id": "c",
        "texto": "7"
      },
      {
        "id": "d",
        "texto": "-1"
      }
    ],
    "correcta": "b",
    "explicacion": "7%2 = 1, distinto de 0, así que la condición n%2==0 es falsa: el ternario retorna 0.",
    "falencia": "Trazar una función que determina si un número es par."
  },
  {
    "id": "prog03_p10",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "En C, los parámetros de una función se pasan:",
    "opciones": [
      {
        "id": "a",
        "texto": "Por referencia siempre, modificando directamente la variable original."
      },
      {
        "id": "b",
        "texto": "Por valor: la función recibe una copia del valor del argumento."
      },
      {
        "id": "c",
        "texto": "Por nombre, sin copiar nada."
      },
      {
        "id": "d",
        "texto": "Depende del tipo de dato del parámetro."
      }
    ],
    "correcta": "b",
    "explicacion": "Salvo que se pase explícitamente un puntero, en C todo parámetro se pasa por valor: la función recibe y trabaja sobre una copia independiente.",
    "falencia": "Mecanismo de paso de parámetros por valor en C."
  },
  {
    "id": "prog03_p11",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "void incrementar(int x){ x = x + 1; }  int numero=5; incrementar(numero); printf(\"%d\", numero);  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "5"
      },
      {
        "id": "b",
        "texto": "6"
      },
      {
        "id": "c",
        "texto": "0"
      },
      {
        "id": "d",
        "texto": "Error de compilación."
      }
    ],
    "correcta": "a",
    "explicacion": "x recibe una copia del valor de numero (5). Modificar x dentro de incrementar no afecta a numero, que sigue valiendo 5.",
    "falencia": "Consecuencia del paso por valor: la función no modifica la variable original."
  },
  {
    "id": "prog03_p12",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "¿Por qué la función incrementar del ejercicio anterior no modifica la variable original numero?",
    "opciones": [
      {
        "id": "a",
        "texto": "Porque x es una copia local independiente del valor de numero; modificar la copia no afecta al original."
      },
      {
        "id": "b",
        "texto": "Porque la función incrementar está mal escrita y tiene un error."
      },
      {
        "id": "c",
        "texto": "Porque numero fue declarada como constante."
      },
      {
        "id": "d",
        "texto": "Porque a la función le falta un return."
      }
    ],
    "correcta": "a",
    "explicacion": "El paso por valor crea una copia independiente en cada llamada; esa copia (x) vive solo dentro de la función y desaparece al terminar, sin afectar la variable del llamador.",
    "falencia": "Explicar el paso por valor con sus propias palabras."
  },
  {
    "id": "prog03_p13",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "¿Qué hace falta para que una función SÍ pueda modificar una variable del código que la llamó?",
    "opciones": [
      {
        "id": "a",
        "texto": "Declarar la variable como global."
      },
      {
        "id": "b",
        "texto": "Pasarle la dirección de memoria de la variable (un puntero) en vez de una copia de su valor."
      },
      {
        "id": "c",
        "texto": "Usar un ciclo dentro de la función."
      },
      {
        "id": "d",
        "texto": "No es posible en C bajo ninguna circunstancia."
      }
    ],
    "correcta": "b",
    "explicacion": "Si la función recibe la dirección de memoria (puntero) de la variable, puede acceder y modificar directamente esa misma posición de memoria, no una copia. Este mecanismo se estudia en la Semana 14 (punteros).",
    "falencia": "Anticipar el mecanismo (punteros) que permite modificar variables del llamador."
  },
  {
    "id": "prog03_p14",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "void f(int x){ printf(\"dentro: %d \", x); x = 100; }  int main(void){ int v=1; f(v); printf(\"fuera: %d\", v); return 0; }  ¿Qué imprime en total?",
    "opciones": [
      {
        "id": "a",
        "texto": "dentro: 1 fuera: 1"
      },
      {
        "id": "b",
        "texto": "dentro: 1 fuera: 100"
      },
      {
        "id": "c",
        "texto": "dentro: 100 fuera: 100"
      },
      {
        "id": "d",
        "texto": "dentro: 100 fuera: 1"
      }
    ],
    "correcta": "a",
    "explicacion": "Dentro de f, x recibe la copia de v (1) y se imprime \"dentro: 1 \" antes de que x se reasigne a 100 (que ya no se imprime). Al volver a main, v sigue siendo 1 (no se tocó, solo su copia x cambió), así que se imprime \"fuera: 1\".",
    "falencia": "Trazar el paso por valor combinando impresión y reasignación dentro de la función."
  },
  {
    "id": "prog03_p15",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "Una variable local (declarada dentro de una función):",
    "opciones": [
      {
        "id": "a",
        "texto": "Es visible y utilizable desde cualquier otra función del programa."
      },
      {
        "id": "b",
        "texto": "Solo existe y es visible mientras se ejecuta la función donde fue declarada."
      },
      {
        "id": "c",
        "texto": "Se comparte automáticamente entre todas las funciones que la usan."
      },
      {
        "id": "d",
        "texto": "Debe declararse siempre anteponiendo la palabra global."
      }
    ],
    "correcta": "b",
    "explicacion": "El ámbito de una variable local se limita a la función donde se declaró: se crea al entrar a la función y se destruye al salir de ella.",
    "falencia": "Ámbito (alcance) y tiempo de vida de una variable local."
  },
  {
    "id": "prog03_p16",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "Una variable global (declarada fuera de todas las funciones):",
    "opciones": [
      {
        "id": "a",
        "texto": "Solo puede declararse dentro de main."
      },
      {
        "id": "b",
        "texto": "Es visible desde cualquier función definida después de ella, y existe durante toda la ejecución del programa."
      },
      {
        "id": "c",
        "texto": "Desaparece automáticamente al terminar la primera función que la usa."
      },
      {
        "id": "d",
        "texto": "Solo puede ser de tipo int."
      }
    ],
    "correcta": "b",
    "explicacion": "Una variable global vive mientras el programa se ejecuta y puede ser leída/modificada por cualquier función que la tenga a la vista (definida después de su declaración).",
    "falencia": "Ámbito (alcance) y tiempo de vida de una variable global."
  },
  {
    "id": "prog03_p17",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "int contadorEventos=0; void registrarEvento(void){ contadorEventos++; }  int main(void){ registrarEvento(); registrarEvento(); registrarEvento(); printf(\"%d\", contadorEventos); return 0; }  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "3"
      },
      {
        "id": "b",
        "texto": "0"
      },
      {
        "id": "c",
        "texto": "1"
      },
      {
        "id": "d",
        "texto": "Error: contadorEventos no es visible dentro de registrarEvento."
      }
    ],
    "correcta": "a",
    "explicacion": "contadorEventos es global, así que registrarEvento la ve y la incrementa cada vez que se llama; tres llamadas la dejan en 3.",
    "falencia": "Usar una variable global compartida entre varias llamadas a una función."
  },
  {
    "id": "prog03_p18",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "¿Por qué se recomienda no abusar de las variables globales?",
    "opciones": [
      {
        "id": "a",
        "texto": "Porque C no permite usarlas dentro de funciones void."
      },
      {
        "id": "b",
        "texto": "Porque cualquier función puede modificarlas en cualquier momento, generando efectos ocultos que dificultan entender y depurar el programa."
      },
      {
        "id": "c",
        "texto": "Porque ocupan mucha más memoria que una variable local equivalente."
      },
      {
        "id": "d",
        "texto": "Porque no se pueden inicializar con un valor al declararlas."
      }
    ],
    "correcta": "b",
    "explicacion": "El riesgo principal de las variables globales no es técnico sino de diseño: al poder ser modificadas desde cualquier función, se vuelve difícil rastrear dónde y cuándo cambia su valor.",
    "falencia": "Riesgo de diseño al abusar de variables globales."
  },
  {
    "id": "prog03_p19",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "Dos funciones distintas, cada una con su propia variable local llamada total (declarada dentro de cada función), ¿interfieren entre sí?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, siempre se sobrescriben porque tienen el mismo nombre."
      },
      {
        "id": "b",
        "texto": "No: cada variable local pertenece solo a su propia función; el mismo nombre en dos funciones distintas son dos variables independientes."
      },
      {
        "id": "c",
        "texto": "Solo interfieren si ambas funciones son void."
      },
      {
        "id": "d",
        "texto": "Depende del orden en que se llamen las funciones."
      }
    ],
    "correcta": "b",
    "explicacion": "El ámbito local significa que el nombre \"total\" dentro de una función no tiene ninguna relación con un \"total\" declarado dentro de otra función: son variables completamente distintas que solo comparten el nombre.",
    "falencia": "Independencia de variables locales con el mismo nombre en funciones distintas."
  },
  {
    "id": "prog03_p20",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "void imprimirTabla(int n){ for(int i=1;i<=10;i++){ printf(\"%d \", n*i); } }  Llamada: imprimirTabla(3). ¿Cuál es el último número impreso?",
    "opciones": [
      {
        "id": "a",
        "texto": "30"
      },
      {
        "id": "b",
        "texto": "10"
      },
      {
        "id": "c",
        "texto": "3"
      },
      {
        "id": "d",
        "texto": "33"
      }
    ],
    "correcta": "a",
    "explicacion": "El ciclo llega hasta i=10, y el último valor impreso es n*i = 3*10 = 30.",
    "falencia": "Trazar una función void que imprime una tabla de multiplicar."
  },
  {
    "id": "prog03_p21",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "int contadorEventos=0; void registrarEvento(void){ int contadorEventos=0; contadorEventos++; }  int main(void){ registrarEvento(); registrarEvento(); printf(\"%d\", contadorEventos); return 0; }  Nota: dentro de registrarEvento se declaró una variable LOCAL con el mismo nombre que la global. ¿Qué imprime el printf de main?",
    "opciones": [
      {
        "id": "a",
        "texto": "0"
      },
      {
        "id": "b",
        "texto": "2"
      },
      {
        "id": "c",
        "texto": "1"
      },
      {
        "id": "d",
        "texto": "Error de compilación."
      }
    ],
    "correcta": "a",
    "explicacion": "La declaración local \"int contadorEventos=0;\" dentro de registrarEvento crea una variable nueva que sombrea (oculta) a la global durante toda esa función: cada llamada reinicia esa copia local en 0, la incrementa a 1, y la descarta al terminar. La variable global de main nunca se toca y sigue en 0.",
    "falencia": "Sombreado (shadowing) de una variable global por una local con el mismo nombre."
  },
  {
    "id": "prog03_p22",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "double promedio(double a,double b,double c){ return (a+b+c)/3.0; }  Llamada: promedio(4.0,5.0,9.0). ¿Qué retorna?",
    "opciones": [
      {
        "id": "a",
        "texto": "6.0"
      },
      {
        "id": "b",
        "texto": "18.0"
      },
      {
        "id": "c",
        "texto": "4.5"
      },
      {
        "id": "d",
        "texto": "9.0"
      }
    ],
    "correcta": "a",
    "explicacion": "(4.0+5.0+9.0)/3.0 = 18.0/3.0 = 6.0.",
    "falencia": "Trazar una función que calcula el promedio de tres valores."
  },
  {
    "id": "prog03_p23",
    "semanaId": 203,
    "tipo": "teoria",
    "pregunta": "En un programa bien modularizado siguiendo diseño descendente, ¿cómo debería verse típicamente la función main?",
    "opciones": [
      {
        "id": "a",
        "texto": "Con cientos de líneas que resuelven todo el problema directamente, sin llamar a otras funciones."
      },
      {
        "id": "b",
        "texto": "Como una secuencia corta de llamadas a funciones, cada una responsable de una tarea bien definida."
      },
      {
        "id": "c",
        "texto": "Vacía, sin ninguna instrucción dentro."
      },
      {
        "id": "d",
        "texto": "Conteniendo únicamente declaraciones de variables globales."
      }
    ],
    "correcta": "b",
    "explicacion": "El diseño descendente delega el trabajo detallado a funciones específicas; main queda como un resumen legible de \"qué hace el programa, en qué orden\".",
    "falencia": "Cómo se ve un main bien modularizado con diseño descendente."
  },
  {
    "id": "prog03_p24",
    "semanaId": 203,
    "tipo": "ejercicio",
    "pregunta": "int maximo(int a,int b,int c);  se escribe antes de main, y la definición completa de maximo aparece después de main, que la llama. ¿Por qué hace falta ese prototipo antes de main?",
    "opciones": [
      {
        "id": "a",
        "texto": "Porque el compilador procesa el archivo de arriba hacia abajo y necesita conocer la firma de maximo antes de encontrar su llamada dentro de main, ya que la definición completa está más abajo."
      },
      {
        "id": "b",
        "texto": "Por pura estética, no cambia nada si se omite."
      },
      {
        "id": "c",
        "texto": "Porque maximo es una función void."
      },
      {
        "id": "d",
        "texto": "Porque maximo tiene exactamente 3 parámetros."
      }
    ],
    "correcta": "a",
    "explicacion": "Sin el prototipo, al llegar a la llamada dentro de main el compilador todavía no habría visto ninguna declaración de maximo (su definición está más abajo en el archivo) y reportaría un error o una advertencia grave.",
    "falencia": "Necesidad del prototipo cuando la definición de la función va después de su primera llamada."
  }
];
