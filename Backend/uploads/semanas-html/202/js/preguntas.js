const PREGUNTAS = [
  {
    "id": "prog02_p1",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "En C, ¿qué valor se considera \"falso\" dentro de una condición (if, while, ...)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Cualquier valor negativo."
      },
      {
        "id": "b",
        "texto": "Solo el valor 0."
      },
      {
        "id": "c",
        "texto": "Cualquier valor distinto de 1."
      },
      {
        "id": "d",
        "texto": "El valor -1."
      }
    ],
    "correcta": "b",
    "explicacion": "En C, el valor 0 se considera falso y cualquier valor distinto de 0 (incluidos los negativos) se considera verdadero.",
    "falencia": "Convención de verdadero/falso en expresiones condicionales de C."
  },
  {
    "id": "prog02_p2",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "¿Cuál es la diferencia principal entre un if-else y el operador ternario (?:)?",
    "opciones": [
      {
        "id": "a",
        "texto": "El ternario no puede anidarse."
      },
      {
        "id": "b",
        "texto": "El ternario es una expresión que produce un valor (útil para asignar directamente); if-else es una instrucción de control, no produce un valor por sí misma."
      },
      {
        "id": "c",
        "texto": "if-else siempre es más rápido."
      },
      {
        "id": "d",
        "texto": "No hay ninguna diferencia."
      }
    ],
    "correcta": "b",
    "explicacion": "El operador ternario evalúa a un valor que se puede usar directamente (por ejemplo, asignarlo a una variable), mientras que if-else solo controla qué bloque de instrucciones se ejecuta.",
    "falencia": "Diferencia entre el operador ternario y la sentencia if-else."
  },
  {
    "id": "prog02_p3",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "¿Cuál es la salida de:  int a=8, b=3, mayor;  mayor = (a>b) ? a : b;  printf(\"%d\", mayor);",
    "opciones": [
      {
        "id": "a",
        "texto": "8"
      },
      {
        "id": "b",
        "texto": "3"
      },
      {
        "id": "c",
        "texto": "1"
      },
      {
        "id": "d",
        "texto": "0"
      }
    ],
    "correcta": "a",
    "explicacion": "La condición a>b (8>3) es verdadera, así que el ternario evalúa al primer valor: mayor=8.",
    "falencia": "Evaluar una expresión con el operador ternario."
  },
  {
    "id": "prog02_p4",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "En una cadena  if / else if / else if / ... / else, ¿cuántos bloques se ejecutan como máximo?",
    "opciones": [
      {
        "id": "a",
        "texto": "Todos los que tengan condición verdadera."
      },
      {
        "id": "b",
        "texto": "Solo uno: el primero (en orden) cuya condición sea verdadera."
      },
      {
        "id": "c",
        "texto": "Ninguno; hace falta usar switch."
      },
      {
        "id": "d",
        "texto": "Depende del compilador."
      }
    ],
    "correcta": "b",
    "explicacion": "Las condiciones se evalúan en orden; en cuanto una es verdadera se ejecuta su bloque y se ignoran las siguientes ramas, aunque también serían verdaderas.",
    "falencia": "Orden de evaluación en una cadena de if / else if / else."
  },
  {
    "id": "prog02_p5",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "float nota=3.2f; if(nota>=4.5f){printf(\"Excelente\");}else if(nota>=3.0f){printf(\"Aprobado\");}else{printf(\"Reprobado\");}  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "Excelente"
      },
      {
        "id": "b",
        "texto": "Aprobado"
      },
      {
        "id": "c",
        "texto": "Reprobado"
      },
      {
        "id": "d",
        "texto": "No imprime nada"
      }
    ],
    "correcta": "b",
    "explicacion": "3.2 no es >=4.5, así que se evalúa la siguiente condición: 3.2>=3.0 es verdadera, se imprime \"Aprobado\".",
    "falencia": "Trazar una cadena if / else if / else con valores flotantes."
  },
  {
    "id": "prog02_p6",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "¿Qué ocurre si se olvida el break al final de un case dentro de un switch?",
    "opciones": [
      {
        "id": "a",
        "texto": "Error de compilación."
      },
      {
        "id": "b",
        "texto": "La ejecución \"cae\" (fall-through) y sigue ejecutando el código del siguiente case, hasta encontrar un break o llegar al final."
      },
      {
        "id": "c",
        "texto": "El programa termina inmediatamente."
      },
      {
        "id": "d",
        "texto": "Solo se ejecuta el default."
      }
    ],
    "correcta": "b",
    "explicacion": "Sin break, C no sale del switch al terminar un case: continúa ejecutando las instrucciones del siguiente case (fall-through), sin volver a comparar su etiqueta.",
    "falencia": "Comportamiento de fall-through en switch-case sin break."
  },
  {
    "id": "prog02_p7",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int opcion=2; switch(opcion){ case 1: printf(\"A\"); break; case 2: printf(\"B\"); break; case 3: printf(\"C\"); break; default: printf(\"D\"); }  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "A"
      },
      {
        "id": "b",
        "texto": "B"
      },
      {
        "id": "c",
        "texto": "C"
      },
      {
        "id": "d",
        "texto": "D"
      }
    ],
    "correcta": "b",
    "explicacion": "opcion vale 2, coincide con case 2: se imprime \"B\" y el break sale del switch sin ejecutar case 3 ni default.",
    "falencia": "Trazar la ejecución de un switch-case con break."
  },
  {
    "id": "prog02_p8",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "Igual que el ejercicio anterior pero SIN el break del case 2 (opcion=2 sigue igual): case 1: printf(\"A\"); break; case 2: printf(\"B\"); case 3: printf(\"C\"); break; default: printf(\"D\");  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "B"
      },
      {
        "id": "b",
        "texto": "BC"
      },
      {
        "id": "c",
        "texto": "BCD"
      },
      {
        "id": "d",
        "texto": "C"
      }
    ],
    "correcta": "b",
    "explicacion": "Al faltar el break en case 2, tras imprimir \"B\" la ejecución cae (fall-through) al case 3, que imprime \"C\" y ahí sí encuentra un break que sale del switch: salida \"BC\".",
    "falencia": "Efecto del fall-through cuando falta un break en un caso intermedio."
  },
  {
    "id": "prog02_p9",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "En la expresión  a && b, si a es falso, ¿se evalúa b?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, siempre se evalúan ambos operandos."
      },
      {
        "id": "b",
        "texto": "No: por cortocircuito (short-circuit), si a ya es falso el resultado de && es falso sin importar b, así que b no se evalúa."
      },
      {
        "id": "c",
        "texto": "Solo si b es una constante."
      },
      {
        "id": "d",
        "texto": "Depende del compilador."
      }
    ],
    "correcta": "b",
    "explicacion": "C evalúa && de izquierda a derecha y se detiene apenas el resultado queda determinado: si a es falso, el && completo ya es falso sin importar b.",
    "falencia": "Evaluación de cortocircuito (short-circuit) del operador &&."
  },
  {
    "id": "prog02_p10",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int edad=20, tiene_carnet=1; if(edad>=18 && tiene_carnet){printf(\"Puede ingresar\");}else{printf(\"No puede ingresar\");}  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "Puede ingresar"
      },
      {
        "id": "b",
        "texto": "No puede ingresar"
      },
      {
        "id": "c",
        "texto": "Error de compilación"
      },
      {
        "id": "d",
        "texto": "No imprime nada"
      }
    ],
    "correcta": "a",
    "explicacion": "edad>=18 (20>=18) es verdadero y tiene_carnet (1) también es verdadero: la condición compuesta es verdadera, se imprime \"Puede ingresar\".",
    "falencia": "Evaluar una condición compuesta con &&."
  },
  {
    "id": "prog02_p11",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int x=0; if (x != 0 && 10/x > 1) { printf(\"ok\"); } else { printf(\"no\"); }  ¿Se llega a ejecutar la división 10/x?",
    "opciones": [
      {
        "id": "a",
        "texto": "No: por el cortocircuito de &&, como x!=0 ya es falso (x vale 0), el segundo operando (10/x) no se evalúa."
      },
      {
        "id": "b",
        "texto": "Sí, C siempre evalúa ambos lados de un &&."
      },
      {
        "id": "c",
        "texto": "Solo si x fuera negativo."
      },
      {
        "id": "d",
        "texto": "Produce un error de compilación."
      }
    ],
    "correcta": "a",
    "explicacion": "x!=0 es falso porque x vale 0, así que el && ya sabe que el resultado es falso sin evaluar el resto: el cortocircuito evita la división por cero.",
    "falencia": "Usar el cortocircuito de && para evitar una operación inválida (división por cero)."
  },
  {
    "id": "prog02_p12",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "for(int i=1;i<=5;i++){ if(i==3) continue; printf(\"%d\",i); }  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "12345"
      },
      {
        "id": "b",
        "texto": "1245"
      },
      {
        "id": "c",
        "texto": "123"
      },
      {
        "id": "d",
        "texto": "12"
      }
    ],
    "correcta": "b",
    "explicacion": "Para i=1,2 se imprime normal. Para i=3, continue salta el printf y pasa a la siguiente iteración (no se imprime 3). Para i=4,5 se imprime normal. Salida: 1245.",
    "falencia": "Trazar un ciclo for con continue."
  },
  {
    "id": "prog02_p13",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "for(int i=1;i<=10;i++){ if(i==7) break; if(i%2==0) continue; printf(\"%d\",i); }  ¿Qué imprime?",
    "opciones": [
      {
        "id": "a",
        "texto": "1357"
      },
      {
        "id": "b",
        "texto": "135"
      },
      {
        "id": "c",
        "texto": "1234567"
      },
      {
        "id": "d",
        "texto": "13579"
      }
    ],
    "correcta": "b",
    "explicacion": "i=1 (impar, imprime 1), i=2 (par, continue), i=3 (imprime 3), i=4 (continue), i=5 (imprime 5), i=6 (continue), i=7: break termina el ciclo antes de imprimir. Salida: 135.",
    "falencia": "Trazar un ciclo for combinando break y continue."
  },
  {
    "id": "prog02_p14",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "¿Cuál es la diferencia clave entre while y do-while?",
    "opciones": [
      {
        "id": "a",
        "texto": "while siempre ejecuta el cuerpo al menos una vez; do-while puede ejecutarlo 0 veces."
      },
      {
        "id": "b",
        "texto": "do-while evalúa la condición al final, así que el cuerpo se ejecuta al menos una vez; while evalúa la condición antes y puede ejecutarse 0 veces."
      },
      {
        "id": "c",
        "texto": "No hay diferencia real, son sinónimos."
      },
      {
        "id": "d",
        "texto": "do-while no admite condiciones compuestas."
      }
    ],
    "correcta": "b",
    "explicacion": "while comprueba la condición antes de cada repetición (si es falsa desde el inicio, el cuerpo nunca se ejecuta); do-while la comprueba después, garantizando al menos una ejecución.",
    "falencia": "Diferencia entre while (condición al inicio) y do-while (condición al final)."
  },
  {
    "id": "prog02_p15",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int contador=1; while(contador<=5){ printf(\"%d\",contador); contador++; }  ¿Cuántas veces se imprime un número?",
    "opciones": [
      {
        "id": "a",
        "texto": "4"
      },
      {
        "id": "b",
        "texto": "5"
      },
      {
        "id": "c",
        "texto": "6"
      },
      {
        "id": "d",
        "texto": "Infinitas veces (ciclo infinito)."
      }
    ],
    "correcta": "b",
    "explicacion": "contador toma los valores 1,2,3,4,5 (se detiene cuando contador=6, ya que 6<=5 es falso): se imprime 5 veces.",
    "falencia": "Contar las repeticiones de un ciclo while con contador."
  },
  {
    "id": "prog02_p16",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int n=5; long factorial=1; for(int i=1;i<=n;i++){ factorial *= i; }  ¿Cuál es el valor final de factorial?",
    "opciones": [
      {
        "id": "a",
        "texto": "120"
      },
      {
        "id": "b",
        "texto": "100"
      },
      {
        "id": "c",
        "texto": "24"
      },
      {
        "id": "d",
        "texto": "25"
      }
    ],
    "correcta": "a",
    "explicacion": "factorial acumula 1×1×2×3×4×5 = 120 (5! = 120).",
    "falencia": "Calcular un factorial acumulando el producto dentro de un ciclo for."
  },
  {
    "id": "prog02_p17",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int n=1234, invertido=0, digito; while(n>0){ digito=n%10; invertido=invertido*10+digito; n/=10; }  ¿Cuál es el valor final de invertido?",
    "opciones": [
      {
        "id": "a",
        "texto": "4321"
      },
      {
        "id": "b",
        "texto": "1234"
      },
      {
        "id": "c",
        "texto": "4320"
      },
      {
        "id": "d",
        "texto": "1243"
      }
    ],
    "correcta": "a",
    "explicacion": "Cada iteración extrae el último dígito de n (con %10) y lo agrega al final de invertido (invertido*10+digito), mientras n pierde ese dígito (n/=10): 1234 se invierte a 4321.",
    "falencia": "Trazar el algoritmo de inversión de dígitos de un número con while."
  },
  {
    "id": "prog02_p18",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "int n=257, suma=0; while(n>0){ suma += n%10; n /= 10; }  ¿Cuál es el valor final de suma?",
    "opciones": [
      {
        "id": "a",
        "texto": "14"
      },
      {
        "id": "b",
        "texto": "257"
      },
      {
        "id": "c",
        "texto": "7"
      },
      {
        "id": "d",
        "texto": "2"
      }
    ],
    "correcta": "a",
    "explicacion": "Se suman los dígitos de 257: 2+5+7=14.",
    "falencia": "Trazar el algoritmo de suma de dígitos de un número con while."
  },
  {
    "id": "prog02_p19",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "¿Cuántas veces se ejecuta el cuerpo del ciclo interno en:  for(int fila=1;fila<=3;fila++){ for(int col=1;col<=4;col++){ ... } }?",
    "opciones": [
      {
        "id": "a",
        "texto": "7 veces."
      },
      {
        "id": "b",
        "texto": "12 veces (3×4)."
      },
      {
        "id": "c",
        "texto": "3 veces."
      },
      {
        "id": "d",
        "texto": "4 veces."
      }
    ],
    "correcta": "b",
    "explicacion": "Por cada una de las 3 repeticiones del ciclo externo, el ciclo interno se ejecuta completo (4 veces): 3×4=12 ejecuciones del cuerpo interno en total.",
    "falencia": "Contar las repeticiones totales de ciclos anidados."
  },
  {
    "id": "prog02_p20",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "Con  int n=17, es_primo=1; for(int i=2;i<n;i++){ if(n%i==0){ es_primo=0; break; } }  ¿Es 17 primo según este código?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí: ningún i entre 2 y 16 divide exactamente a 17, así que es_primo se queda en 1."
      },
      {
        "id": "b",
        "texto": "No: es_primo termina en 0."
      },
      {
        "id": "c",
        "texto": "El programa entra en un ciclo infinito."
      },
      {
        "id": "d",
        "texto": "Produce un error de división."
      }
    ],
    "correcta": "a",
    "explicacion": "17 no tiene divisores exactos entre 2 y 16, así que la condición n%i==0 nunca se cumple, es_primo nunca cambia y el ciclo termina normalmente con es_primo=1.",
    "falencia": "Trazar el algoritmo de prueba de primalidad por división."
  },
  {
    "id": "prog02_p21",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "Mismo código del ejercicio anterior pero con n=15. ¿Es 15 primo según el código?",
    "opciones": [
      {
        "id": "a",
        "texto": "Sí, es primo."
      },
      {
        "id": "b",
        "texto": "No: en i=3, 15%3==0, así que es_primo pasa a 0 y break termina el ciclo."
      },
      {
        "id": "c",
        "texto": "Depende del compilador."
      },
      {
        "id": "d",
        "texto": "El ciclo nunca se ejecuta."
      }
    ],
    "correcta": "b",
    "explicacion": "En i=2, 15%2=1 (no divide). En i=3, 15%3=0: es_primo se pone en 0 y break sale del ciclo de inmediato.",
    "falencia": "Trazar el algoritmo de prueba de primalidad con un número compuesto."
  },
  {
    "id": "prog02_p22",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "¿Para qué sirve la instrucción break dentro de un ciclo (for/while/do-while)?",
    "opciones": [
      {
        "id": "a",
        "texto": "Salta la iteración actual y continúa con la siguiente."
      },
      {
        "id": "b",
        "texto": "Termina inmediatamente el ciclo (o switch) que lo contiene."
      },
      {
        "id": "c",
        "texto": "Reinicia el ciclo desde el principio."
      },
      {
        "id": "d",
        "texto": "Solo funciona dentro de un switch, no en ciclos."
      }
    ],
    "correcta": "b",
    "explicacion": "break sale de inmediato del ciclo (o switch) más interno que lo contiene, sin evaluar más repeticiones.",
    "falencia": "Efecto de break dentro de un ciclo."
  },
  {
    "id": "prog02_p23",
    "semanaId": 202,
    "tipo": "teoria",
    "pregunta": "¿Para qué sirve la instrucción continue dentro de un ciclo?",
    "opciones": [
      {
        "id": "a",
        "texto": "Termina el ciclo inmediatamente, igual que break."
      },
      {
        "id": "b",
        "texto": "Salta el resto del cuerpo del ciclo en la iteración actual y pasa directamente a evaluar la siguiente repetición."
      },
      {
        "id": "c",
        "texto": "Es equivalente a break."
      },
      {
        "id": "d",
        "texto": "Termina el programa completo."
      }
    ],
    "correcta": "b",
    "explicacion": "continue no termina el ciclo: solo omite las instrucciones restantes del cuerpo en esa iteración y continúa con la siguiente (reevaluando la condición del ciclo).",
    "falencia": "Efecto de continue dentro de un ciclo."
  },
  {
    "id": "prog02_p24",
    "semanaId": 202,
    "tipo": "ejercicio",
    "pregunta": "Un programa necesita pedir una opción de menú (1-3) por teclado y repetir la pregunta mientras la opción no sea válida. ¿Por qué do-while es más natural que while para este caso?",
    "opciones": [
      {
        "id": "a",
        "texto": "Porque hay que pedirle el dato al usuario al menos una vez antes de poder validarlo; do-while garantiza esa primera ejecución sin necesitar un valor centinela inicial."
      },
      {
        "id": "b",
        "texto": "Porque do-while es más rápido de ejecutar."
      },
      {
        "id": "c",
        "texto": "Porque while no admite condiciones compuestas."
      },
      {
        "id": "d",
        "texto": "No hay ninguna diferencia real entre usar una u otra."
      }
    ],
    "correcta": "a",
    "explicacion": "Con while habría que inicializar la variable de opción con un valor inválido \"de mentiras\" antes del ciclo para que la primera comprobación falle; do-while evita ese truco porque ejecuta el cuerpo (pedir el dato) antes de comprobar la condición.",
    "falencia": "Elegir la estructura de ciclo adecuada para validar una entrada de usuario."
  }
];
