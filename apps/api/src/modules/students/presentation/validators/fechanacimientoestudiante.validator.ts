import {
  ValidatorConstraint,
  type ValidationArguments,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { obtenererrorfechanacimientoestudiante } from '@academic/academic-domain';

@ValidatorConstraint({ name: 'fechaNacimientoEstudianteCoherente', async: false })
export class validacionfechanacimientoestudiante implements ValidatorConstraintInterface {
  validate(valor: unknown): boolean {
    return obtenererrorfechanacimientoestudiante(valor) === null;
  }

  defaultMessage(argumentos: ValidationArguments): string {
    return (
      obtenererrorfechanacimientoestudiante(argumentos.value) ??
      'La fecha de nacimiento del estudiante no es coherente.'
    );
  }
}
