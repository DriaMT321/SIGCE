import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class dtocrearperiodo {
  @IsUUID()
  academicYearId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsInt()
  @Min(1)
  @Max(10)
  number: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class dtoactualizarperiodo {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;

  @IsOptional()
  @IsBoolean()
  confirmClose?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  expectedGradeCount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
