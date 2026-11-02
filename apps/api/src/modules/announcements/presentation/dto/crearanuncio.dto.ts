import {
  alcanceanuncio,
  urgenciaanuncio,
  type codigoalcanceanuncio,
  type codigourgenciaanuncio,
} from '@academic/shared-types';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  Validate,
  ValidateIf,
  ValidatorConstraint,
  type ValidationArguments,
  type ValidatorConstraintInterface,
} from 'class-validator';

const anuncioscopes = Object.values(alcanceanuncio);
const anunciourgencies = Object.values(urgenciaanuncio);

@ValidatorConstraint({ name: 'announcementTargetMatchesScope', async: false })
class destinoanunciocoincideconalcance implements ValidatorConstraintInterface {
  validate(_valor: unknown, args?: ValidationArguments): boolean {
    if (!args) return false;
    const anuncio = args.object as dtocrearanuncio;
    const tienecurso = anuncio.targetCourseId !== undefined && anuncio.targetCourseId !== null;
    const tienefamiliar = anuncio.targetParentId !== undefined && anuncio.targetParentId !== null;
    const tienedocente = anuncio.targetTeacherId !== undefined && anuncio.targetTeacherId !== null;
    const tieneusuarios = anuncio.targetUserIds !== undefined && anuncio.targetUserIds !== null;
    switch (anuncio.scope) {
      case alcanceanuncio.COURSE:
        return tienecurso && !tienefamiliar && !tienedocente && !tieneusuarios;
      case alcanceanuncio.PARENT:
        return tienefamiliar && !tienecurso && !tienedocente && !tieneusuarios;
      case alcanceanuncio.TEACHER:
        return tienedocente && !tienecurso && !tienefamiliar && !tieneusuarios;
      case alcanceanuncio.SPECIFIC_PARENTS:
      case alcanceanuncio.SPECIFIC_TEACHERS:
      case alcanceanuncio.SPECIFIC_STUDENTS:
        return (
          Boolean(anuncio.targetUserIds?.length) && !tienecurso && !tienefamiliar && !tienedocente
        );
      default:
        return !tienecurso && !tienefamiliar && !tienedocente && !tieneusuarios;
    }
  }

  defaultmensaje(): string {
    return 'El alcance del comunicado requiere un destinatario compatible';
  }
}

export class dtocrearanuncio {
  @IsString()
  @MinLength(1)
  @Matches(/\S/)
  title: string;

  @IsString()
  @MinLength(1)
  @Matches(/\S/)
  content: string;

  @IsIn(anunciourgencies)
  urgency: codigourgenciaanuncio;

  @IsIn(anuncioscopes)
  @Validate(destinoanunciocoincideconalcance)
  scope: codigoalcanceanuncio;

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsUUID()
  targetCourseId?: string;

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsUUID()
  targetParentId?: string;

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsUUID()
  targetTeacherId?: string;

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  targetUserIds?: string[];
}
