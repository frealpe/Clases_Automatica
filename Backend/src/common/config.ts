// Lectura validada de variables de entorno sensibles. Se importa desde app.module.ts y
// jwt.strategy.ts para que el backend falle de inmediato al arrancar si la configuración de
// seguridad no está puesta, en vez de caer a un valor por defecto conocido y adivinable.

export function obtenerJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      'JWT_SECRET no está definido o es demasiado corto (< 16 caracteres). ' +
        'Configúralo en el .env del backend antes de arrancar (ver Backend/.env.example).',
    );
  }
  return secret;
}
