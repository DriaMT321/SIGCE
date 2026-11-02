import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { estadosincronizacionsie } from '@academic/domain-kernel';
import { dtopaginacionsinbusqueda } from '../../../../common/dto/paginacion.dto';

export class dtofiltrossincronizacionsie extends dtopaginacionsinbusqueda {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9999)
  academicYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2, 3])
  periodNumber?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  courseName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  studentRude?: string;

  @IsOptional()
  @IsIn(Object.values(estadosincronizacionsie))
  status?: `${estadosincronizacionsie}`;
}
