import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PreguntasController } from './preguntas/preguntas.controller';
import { EvaluacionesController } from './evaluaciones/evaluaciones.controller';
import { MateriasController } from './materias/materias.controller';
import { SemanasController } from './semanas/semanas.controller';
import { EstudiantesController } from './estudiantes/estudiantes.controller';
import { ExamenesProgramadosController } from './examenes-programados/examenes-programados.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'super_secret_jwt_key_unicauca_2026',
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  controllers: [AuthController, PreguntasController, EvaluacionesController, MateriasController, SemanasController, EstudiantesController, ExamenesProgramadosController],
  providers: [AuthService, JwtStrategy],
})
export class AppModule {}
