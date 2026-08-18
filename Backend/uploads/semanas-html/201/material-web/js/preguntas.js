const PREGUNTAS = [
  {
    "id": "prog01_p1",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "En el proceso de compilación de un programa en C con gcc, ¿cuál es el orden correcto de las cuatro etapas?",
    "opciones": [
      { "id": "a", "texto": "Compilador → Preprocesador → Ensamblador → Enlazador." },
      { "id": "b", "texto": "Preprocesador → Compilador → Ensamblador → Enlazador." },
      { "id": "c", "texto": "Ensamblador → Compilador → Preprocesador → Enlazador." },
      { "id": "d", "texto": "Preprocesador → Enlazador → Compilador → Ensamblador." }
    ],
    "correcta": "b",
    "explicacion": "El preprocesador procesa las directivas #, el compilador traduce el código preprocesado a ensamblador, el ensamblador lo traduce a código objeto y el enlazador combina ese código objeto con las librerías necesarias para producir el ejecutable.",
    "falencia": "Orden de las cuatro etapas del proceso de compilación en C."
  },
  {
    "id": "prog01_p2",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Qué hace el preprocesador con una directiva como #include <stdio.h>?",
    "opciones": [
      { "id": "a", "texto": "La compila directamente a código máquina." },
      { "id": "b", "texto": "Procesa las directivas que empiezan por #, sustituyéndolas (en este caso, incluyendo las declaraciones necesarias de la librería) antes de compilar." },
      { "id": "c", "texto": "La ignora, es solo un comentario para el programador." },
      { "id": "d", "texto": "La ejecuta en tiempo de ejecución del programa." }
    ],
    "correcta": "b",
    "explicacion": "El preprocesador es la primera etapa: procesa todas las directivas que empiezan por # (#include, #define, ...) y las sustituye antes de que el compilador vea el código.",
    "falencia": "Función del preprocesador sobre directivas que empiezan por #."
  },
  {
    "id": "prog01_p3",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Qué elemento es obligatorio, como mínimo, en todo programa en C ejecutable?",
    "opciones": [
      { "id": "a", "texto": "Una directiva #define." },
      { "id": "b", "texto": "Una función main, que es el punto de entrada: la primera función que se ejecuta al correr el programa." },
      { "id": "c", "texto": "Un comentario inicial con el nombre del autor." },
      { "id": "d", "texto": "Una variable global de tipo int." }
    ],
    "correcta": "b",
    "explicacion": "Todo programa en C ejecutable necesita una función main, que es el punto de entrada del programa.",
    "falencia": "Estructura mínima de un programa en C: la función main como punto de entrada."
  },
  {
    "id": "prog01_p4",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "El siguiente código tiene errores de sintaxis:  #include <stdio.h>  int main(void)  int x = 5  printf(\"x vale %d\", x);  return 0; }  ¿Cuántos errores hay y cuáles son?",
    "opciones": [
      { "id": "a", "texto": "1 error: falta el return." },
      { "id": "b", "texto": "3 errores: falta la llave de apertura { después de main(void), falta el punto y coma tras int x = 5, y sobra la llave de cierre } final porque nunca se abrió la primera." },
      { "id": "c", "texto": "2 errores: faltan dos puntos y comas." },
      { "id": "d", "texto": "El código es válido, compila sin problemas." }
    ],
    "correcta": "b",
    "explicacion": "Faltan la llave { que abre el cuerpo de main y el ; tras la declaración de x; y sobra la } final, que en el original cierra un bloque que nunca se abrió.",
    "falencia": "Detectar errores de sintaxis comunes: llaves y puntos y coma faltantes o sobrantes."
  },
  {
    "id": "prog01_p5",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Cuál de los cuatro tipos de datos básicos de C representa un solo carácter (código ASCII)?",
    "opciones": [
      { "id": "a", "texto": "int" },
      { "id": "b", "texto": "float" },
      { "id": "c", "texto": "double" },
      { "id": "d", "texto": "char" }
    ],
    "correcta": "d",
    "explicacion": "char almacena un solo carácter, representado internamente por su código ASCII.",
    "falencia": "Identificar el tipo de dato básico para un solo carácter."
  },
  {
    "id": "prog01_p6",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "En un compilador típico de 64 bits (por ejemplo gcc en Linux), ¿cuántos bytes ocupa normalmente un int?",
    "opciones": [
      { "id": "a", "texto": "2" },
      { "id": "b", "texto": "4" },
      { "id": "c", "texto": "8" },
      { "id": "d", "texto": "16" }
    ],
    "correcta": "b",
    "explicacion": "int ocupa 4 bytes en la mayoría de compiladores de 64 bits, con rango aproximado de -2.147.483.648 a 2.147.483.647; el tamaño exacto debe confirmarse con sizeof en cada entorno.",
    "falencia": "Tamaño en bytes de int en un compilador típico de 64 bits."
  },
  {
    "id": "prog01_p7",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Cuál es el rango típico de un unsigned char (1 byte)?",
    "opciones": [
      { "id": "a", "texto": "-128 a 127" },
      { "id": "b", "texto": "0 a 255" },
      { "id": "c", "texto": "0 a 65535" },
      { "id": "d", "texto": "-255 a 255" }
    ],
    "correcta": "b",
    "explicacion": "Un unsigned char ocupa 1 byte (8 bits) y, al no tener signo, representa valores de 0 a 255.",
    "falencia": "Rango de un tipo entero sin signo de 1 byte (unsigned char)."
  },
  {
    "id": "prog01_p8",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "El sufijo f al final de un literal numérico, como en 3.14f, ¿qué le indica al compilador?",
    "opciones": [
      { "id": "a", "texto": "Que el valor es una constante entera larga." },
      { "id": "b", "texto": "Que el literal debe interpretarse como float (precisión simple), no como double." },
      { "id": "c", "texto": "Que el valor no puede modificarse (equivalente a const)." },
      { "id": "d", "texto": "Que el valor es sin signo (unsigned)." }
    ],
    "correcta": "b",
    "explicacion": "Los sufijos de un literal indican al compilador el tipo exacto: f para float, L/LL para enteros largos, U para sin signo, L para long double.",
    "falencia": "Significado del sufijo f en un literal numérico (float)."
  },
  {
    "id": "prog01_p9",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Cuál es el especificador de formato correcto para imprimir una variable long int con printf?",
    "opciones": [
      { "id": "a", "texto": "%d" },
      { "id": "b", "texto": "%ld" },
      { "id": "c", "texto": "%lld" },
      { "id": "d", "texto": "%f" }
    ],
    "correcta": "b",
    "explicacion": "Cada tipo tiene su propio especificador: %d para int, %ld para long int, %lld para long long int; usar el incorrecto es un error común que produce salidas basura.",
    "falencia": "Especificador de formato correcto en printf para cada tipo entero."
  },
  {
    "id": "prog01_p10",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "char letra = 'A'; printf(\"%d\", letra);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "A" },
      { "id": "b", "texto": "65" },
      { "id": "c", "texto": "0" },
      { "id": "d", "texto": "Error de compilación, porque %d no sirve para char." }
    ],
    "correcta": "b",
    "explicacion": "Internamente un char es un entero pequeño; 'A' corresponde al código ASCII 65, que es lo que %d imprime.",
    "falencia": "Relación entre un char y su código ASCII al imprimirlo con %d."
  },
  {
    "id": "prog01_p11",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Cuál es la diferencia principal entre #define NOMBRE valor y const tipo NOMBRE = valor;?",
    "opciones": [
      { "id": "a", "texto": "No hay ninguna diferencia real." },
      { "id": "b", "texto": "#define es una sustitución de texto del preprocesador, sin tipo ni verificación; const declara una variable con tipo, verificada por el compilador." },
      { "id": "c", "texto": "const es más antiguo y ya no se recomienda usar." },
      { "id": "d", "texto": "#define solo funciona con números enteros." }
    ],
    "correcta": "b",
    "explicacion": "#define es sustitución de texto pura (sin tipo, la aplica el preprocesador); const califica una variable con tipo, cuyo uso el compilador sí verifica.",
    "falencia": "Diferencia entre una constante por #define y una constante con const."
  },
  {
    "id": "prog01_p12",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "Una macro definida con #define que recibe parámetros, ¿cómo se procesa?",
    "opciones": [
      { "id": "a", "texto": "El compilador la trata como una llamada a función normal en tiempo de ejecución." },
      { "id": "b", "texto": "El preprocesador sustituye cada llamada por su definición textual, parámetro por parámetro, antes de que el compilador vea el código; no implica una llamada real en tiempo de ejecución." },
      { "id": "c", "texto": "Se ejecuta una sola vez al iniciar el programa." },
      { "id": "d", "texto": "Requiere que todos los parámetros sean del mismo tipo." }
    ],
    "correcta": "b",
    "explicacion": "Una macro con parámetros es sustitución textual del preprocesador: reemplaza cada llamada por su definición, parámetro por parámetro, antes de compilar; a diferencia de una función, no hay una llamada real en tiempo de ejecución.",
    "falencia": "Cómo procesa el preprocesador una macro con parámetros (sustitución textual, no llamada)."
  },
  {
    "id": "prog01_p13",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Cuál de los siguientes es un identificador (nombre de variable) válido en C?",
    "opciones": [
      { "id": "a", "texto": "2valor" },
      { "id": "b", "texto": "valor_2" },
      { "id": "c", "texto": "int" },
      { "id": "d", "texto": "precio-total" }
    ],
    "correcta": "b",
    "explicacion": "Un identificador empieza por letra o guion bajo, sigue con letras/dígitos/guiones bajos, y no puede ser una palabra reservada (int) ni empezar con un dígito (2valor) ni contener un guion medio (precio-total, que C interpretaría como una resta).",
    "falencia": "Reglas de formación de un identificador (nombre de variable) válido en C."
  },
  {
    "id": "prog01_p14",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int a=7, b=2; printf(\"%d\", a/b);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "3.5" },
      { "id": "b", "texto": "3" },
      { "id": "c", "texto": "4" },
      { "id": "d", "texto": "1" }
    ],
    "correcta": "b",
    "explicacion": "La división entre dos int trunca el resultado: 7/2 da 3 (se descarta la parte decimal).",
    "falencia": "División entera entre dos variables int (trunca, no redondea)."
  },
  {
    "id": "prog01_p15",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int a=7, b=2; printf(\"%d\", a%b);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "3" },
      { "id": "b", "texto": "1" },
      { "id": "c", "texto": "0" },
      { "id": "d", "texto": "3.5" }
    ],
    "correcta": "b",
    "explicacion": "% es el operador de residuo (módulo); 7 dividido entre 2 da cociente 3 y residuo 1.",
    "falencia": "Operador de residuo (%) entre dos enteros."
  },
  {
    "id": "prog01_p16",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int a=7, b=2; printf(\"%f\", (float)a / b);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "3" },
      { "id": "b", "texto": "3.500000" },
      { "id": "c", "texto": "3.5" },
      { "id": "d", "texto": "Error de compilación" }
    ],
    "correcta": "b",
    "explicacion": "(float)a convierte a a real antes de dividir, así que la división ya no trunca: 7.0/2 = 3.5; %f imprime 6 decimales por defecto: 3.500000.",
    "falencia": "Efecto de una conversión explícita (cast) antes de una división para evitar el truncamiento entero."
  },
  {
    "id": "prog01_p17",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Por qué scanf(\"%d\", &edad) necesita el operador & delante de la variable edad?",
    "opciones": [
      { "id": "a", "texto": "Es un error común, en realidad no se necesita." },
      { "id": "b", "texto": "Porque scanf necesita la dirección de memoria de la variable para poder escribir el valor leído ahí; sin &, no tendría dónde guardar el dato." },
      { "id": "c", "texto": "Porque edad es una variable de tipo entero." },
      { "id": "d", "texto": "Solo se necesita si edad no fue inicializada antes." }
    ],
    "correcta": "b",
    "explicacion": "scanf escribe el valor leído directamente en memoria, así que necesita la dirección de la variable (&); las cadenas (char[]) son la excepción porque el nombre del arreglo ya es una dirección.",
    "falencia": "Por qué scanf requiere el operador & (dirección de memoria) delante de la variable."
  },
  {
    "id": "prog01_p18",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int x=5; x++; printf(\"%d\", x);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "5" },
      { "id": "b", "texto": "6" },
      { "id": "c", "texto": "4" },
      { "id": "d", "texto": "Error de compilación" }
    ],
    "correcta": "b",
    "explicacion": "x++ incrementa x en 1 como sentencia independiente; después x vale 6.",
    "falencia": "Efecto del operador de incremento (++) como sentencia independiente."
  },
  {
    "id": "prog01_p19",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int x=5; printf(\"%d\", x++);  ¿Qué imprime, y en qué orden actúa el postfijo ++?",
    "opciones": [
      { "id": "a", "texto": "Imprime 6: primero incrementa y luego usa el valor." },
      { "id": "b", "texto": "Imprime 5: el postfijo x++ usa primero el valor actual de x en la expresión y luego lo incrementa." },
      { "id": "c", "texto": "Imprime 5 y no incrementa x." },
      { "id": "d", "texto": "Produce un error porque ++ no puede usarse dentro de printf." }
    ],
    "correcta": "b",
    "explicacion": "El postfijo x++ evalúa la expresión con el valor actual de x (5) y el incremento ocurre después; x queda en 6 pero lo impreso es 5.",
    "falencia": "Diferencia entre incremento postfijo (x++) y su efecto dentro de una expresión."
  },
  {
    "id": "prog01_p20",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int x=5; printf(\"%d\", ++x);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "5" },
      { "id": "b", "texto": "6" },
      { "id": "c", "texto": "4" },
      { "id": "d", "texto": "Depende del compilador." }
    ],
    "correcta": "b",
    "explicacion": "El prefijo ++x incrementa x primero y luego usa el nuevo valor en la expresión: se imprime 6.",
    "falencia": "Diferencia entre incremento prefijo (++x) y postfijo (x++) dentro de una expresión."
  },
  {
    "id": "prog01_p21",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int a=3, b=4, c; c = a + b * 2;  ¿Cuál es el valor final de c?",
    "opciones": [
      { "id": "a", "texto": "14" },
      { "id": "b", "texto": "11" },
      { "id": "c", "texto": "10" },
      { "id": "d", "texto": "8" }
    ],
    "correcta": "b",
    "explicacion": "Por precedencia de operadores, * se evalúa antes que +: b*2=8, luego a+8=11.",
    "falencia": "Precedencia de operadores aritméticos (* antes que +) al evaluar una expresión."
  },
  {
    "id": "prog01_p22",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "int a=10; a += 5; a *= 2; printf(\"%d\", a);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "20" },
      { "id": "b", "texto": "30" },
      { "id": "c", "texto": "15" },
      { "id": "d", "texto": "25" }
    ],
    "correcta": "b",
    "explicacion": "a += 5 deja a en 15; a *= 2 lo duplica a 30.",
    "falencia": "Trazar operadores de asignación compuesta (+=, *=) en secuencia."
  },
  {
    "id": "prog01_p23",
    "semanaId": 201,
    "tipo": "teoria",
    "pregunta": "¿Qué valores puede producir un operador relacional en C, como en la expresión 5 > 3?",
    "opciones": [
      { "id": "a", "texto": "verdadero o falso, como un tipo booleano nativo distinto de los enteros." },
      { "id": "b", "texto": "0 (falso) o 1 (verdadero), representados como enteros — C no tenía un tipo booleano nativo antes de C99 (stdbool.h)." },
      { "id": "c", "texto": "Cualquier número entero, según la magnitud de la comparación." },
      { "id": "d", "texto": "Un error de compilación si se usa fuera de un if." }
    ],
    "correcta": "b",
    "explicacion": "Los operadores relacionales (== != < > <= >=) resultan en 0 (falso) o 1 (verdadero), valores enteros ordinarios.",
    "falencia": "Valores que produce un operador relacional en C (0 o 1, no un booleano nativo)."
  },
  {
    "id": "prog01_p24",
    "semanaId": 201,
    "tipo": "ejercicio",
    "pregunta": "float base = 6.0f, altura = 4.5f, area;  area = base * altura / 2;  printf(\"%.2f\", area);  ¿Qué imprime?",
    "opciones": [
      { "id": "a", "texto": "13.50" },
      { "id": "b", "texto": "27.00" },
      { "id": "c", "texto": "10.50" },
      { "id": "d", "texto": "13.5000" }
    ],
    "correcta": "a",
    "explicacion": "base*altura = 27.0; dividido entre 2 da 13.5; %.2f lo imprime con dos decimales: 13.50.",
    "falencia": "Trazar el cálculo del área de un triángulo con variables float y formato de impresión con decimales fijos."
  }
];
