import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PreguntasController } from './preguntas/preguntas.controller';
import { EvaluacionesController } from './evaluaciones/evaluaciones.controller';
import { MateriasController } from './materias/materias.controller';
import { SemanasController } from './semanas/semanas.controller';
import { EstudiantesController } from './estudiantes/estudiantes.controller';
import { ExamenesProgramadosController } from './examenes-programados/examenes-programados.controller';
import { AsistenciaController } from './asistencia/asistencia.controller';
import { VisitasController } from './visitas/visitas.controller';
import { DatabaseModule } from './database/database.module';
import { obtenerJwtSecret } from './common/config';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: obtenerJwtSecret(),
        signOptions: { expiresIn: '2h' },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    AuthController,
    PreguntasController,
    EvaluacionesController,
    MateriasController,
    SemanasController,
    EstudiantesController,
    ExamenesProgramadosController,
    AsistenciaController,
    VisitasController,
  ],
  providers: [AuthService, JwtStrategy],
})
export class AppModule {}
