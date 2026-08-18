import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('register')
  async registrar(@Body() body: { nombre: string; email: string; password: string; rol?: string }) {
    return this.authService.registrar(body);
  }

  // Listar usuarios: docentes y superusuarios
  @Get('usuarios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSUARIO', 'DOCENTE')
  async listarUsuarios() {
    return this.authService.listarUsuarios();
  }

  // Alta de cuentas DOCENTE/SUPERUSUARIO: solo un SUPERUSUARIO puede otorgar esos roles.
  @Post('usuarios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSUARIO', 'DOCENTE')
  async crearUsuarioConRol(
    @Body() body: { nombre: string; email: string; password: string; rol: string; documentoIdentidad?: string; materiaIds?: number[] },
  ) {
    return this.authService.crearUsuarioConRol(body);
  }

  @Patch('usuarios/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSUARIO', 'DOCENTE')
  async actualizarUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { nombre?: string; email?: string; rol?: string; password?: string; documentoIdentidad?: string; materiaIds?: number[] },
  ) {
    return this.authService.actualizarUsuario(id, body);
  }

  @Delete('usuarios/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSUARIO', 'DOCENTE')
  async eliminarUsuario(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    if (req.user && req.user.id === id) {
      throw new BadRequestException('No puedes eliminar tu propia cuenta en sesión activa');
    }
    return this.authService.eliminarUsuario(id);
  }
}
