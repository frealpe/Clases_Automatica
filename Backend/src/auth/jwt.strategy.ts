import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { obtenerJwtSecret } from '../common/config';

interface JwtPayload {
  sub: number;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: obtenerJwtSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, nombre: payload.nombre, email: payload.email, rol: payload.rol };
  }
}
