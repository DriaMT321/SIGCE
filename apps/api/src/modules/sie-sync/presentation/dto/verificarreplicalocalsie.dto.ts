import { IsOptional, IsString, MaxLength } from 'class-validator';

export class dtoverificarreplicalocalsie {
  @IsOptional()
  @IsString()
  @MaxLength(500_000)
  html?: string;
}
