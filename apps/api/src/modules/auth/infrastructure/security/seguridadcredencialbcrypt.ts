import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { seguridadcredencialespuerto } from '../../application/ports/seguridadcredencial.port';

@Injectable()
export class seguridadcredencialesbcrypt implements seguridadcredencialespuerto {
  generartoken(): string {
    return randomBytes(32).toString('base64url');
  }

  resumirtoken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  resumircontrasena(contrasena: string): Promise<string> {
    return bcrypt.hash(contrasena, 12);
  }

  verificarcontrasena(contrasena: string, hashcontrasena: string): Promise<boolean> {
    return bcrypt.compare(contrasena, hashcontrasena);
  }
}
