import { IsBoolean, IsIn, IsInt, IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class dtoactualizarreglaalerta {
  @IsBoolean()
  enabled: boolean;

  @IsIn(['INFO', 'WARNING', 'DANGER', 'SUCCESS'])
  severity: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsNumber()
  @Min(0)
  @Max(100)
  gradeThreshold?: number;

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsInt()
  @Min(1)
  @Max(30)
  absenceThreshold?: number;

  @ValidateIf((_object, valor) => valor !== undefined)
  @IsInt()
  @Min(1)
  @Max(365)
  absenceWindowDays?: number;
}
