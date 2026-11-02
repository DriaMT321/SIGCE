import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class dtoverificaraccesosie {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  password: string;
}
