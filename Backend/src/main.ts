import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(json({ limit: '150mb' }));
  app.use(urlencoded({ limit: '150mb', extended: true }));

  // Servir PDFs subidos (notas/guía/diapositivas por semana) como archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // Variables de Entorno (.env)
  const PORT = process.env.PORT || 3000;

  // CORS: lista blanca explícita desde CORS_ORIGIN (separada por comas). Nunca '*': la app web
  // se sirve del mismo origen tras el proxy nginx y la app móvil no manda cabecera Origin, así
  // que restringir aquí no rompe nada y cierra el uso del API desde sitios de terceros.
  // credentials: false — el sistema autentica con Bearer token en cabecera, no con cookies.
  const CORS_ORIGIN = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: CORS_ORIGIN
      ? CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
      : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  await app.listen(PORT);
  console.log(`🚀 Servidor NestJS ejecutándose en puerto ${PORT} (Variables .env cargadas)`);
}
bootstrap();
