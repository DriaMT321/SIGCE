import { estadoplanestudio } from '@academic/shared-types';
import {
  Validate,
  ValidatorConstraint,
  type ValidationArguments,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'optionalCurriculumStatus', async: false })
class optionalcurriculumestado implements ValidatorConstraintInterface {
  validate(valor: unknown): boolean {
    return (
      valor === undefined || Object.values(estadoplanestudio).includes(valor as estadoplanestudio)
    );
  }

  defaultmensaje(): string {
    return 'El estado curricular no es válido';
  }
}

@ValidatorConstraint({ name: 'optionalProgressPercent', async: false })
class optionalavanceporcentaje implements ValidatorConstraintInterface {
  validate(valor: unknown): boolean {
    return (
      valor === undefined ||
      (typeof valor === 'number' && Number.isInteger(valor) && valor >= 0 && valor <= 100)
    );
  }

  defaultmensaje(): string {
    return 'El progreso debe ser un número entero entre 0 y 100';
  }
}

@ValidatorConstraint({ name: 'curriculumProgressUpdateRequired', async: false })
class curriculumavanceactualizarrequerido implements ValidatorConstraintInterface {
  validate(_valor: unknown, args: ValidationArguments): boolean {
    const actualizar = args.object as dtoactualizaravancecurricular;
    return actualizar.status !== undefined || actualizar.progressPercent !== undefined;
  }

  defaultmensaje(): string {
    return 'Debe proporcionar un estado o un porcentaje de avance';
  }
}

export class dtoactualizaravancecurricular {
  @Validate(optionalcurriculumestado)
  @Validate(curriculumavanceactualizarrequerido)
  status?: estadoplanestudio;

  @Validate(optionalavanceporcentaje)
  progressPercent?: number;
}
