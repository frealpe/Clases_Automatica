import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir PDFs subidos (notas/guía/diapositivas por semana) como archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // Variables de Entorno (.env)
  const PORT = process.env.PORT || 3000;
  const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

  // Habilitar CORS dinámico desde .env
  app.enableCors({
    origin: CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  await app.listen(PORT);
  console.log(`🚀 Servidor NestJS ejecutándose en puerto ${PORT} (Variables .env cargadas)`);
}
bootstrap();
