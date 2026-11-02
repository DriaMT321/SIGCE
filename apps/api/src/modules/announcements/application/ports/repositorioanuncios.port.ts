import { codigoalcanceanuncio, codigourgenciaanuncio } from '@academic/domain-kernel';
import { actorusuario } from '../../../../core/application/actorusuario';

export interface datoscreacionanuncio {
  title: string;
  content: string;
  urgency: codigourgenciaanuncio;
  scope: codigoalcanceanuncio;
  targetCourseId?: string;
  targetParentId?: string;
  targetTeacherId?: string;
  targetUserIds?: string[];
}

export interface registroanuncio {
  id: string;
  title: string;
  content: string;
  urgency: codigourgenciaanuncio;
  scope: codigoalcanceanuncio;
  createdAt: Date;
}

export interface repositorioanuncios {
  buscarvisiblespara(usuario: actorusuario): Promise<registroanuncio[]>;
  eliminar(id: string): Promise<boolean>;
}

export const tokenrepositorioanuncios = Symbol('ANNOUNCEMENT_REPOSITORY');
