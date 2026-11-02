import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class dtosolicitarcorreccioncalificacion {
  @IsUUID()
  gradeId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  proposedValue: number;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  reason: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  evidenceReference: string;
}

export class dtodecidircorreccioncalificacion {
  @IsBoolean()
  approve: boolean;

  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  decisionReason: string;
}
