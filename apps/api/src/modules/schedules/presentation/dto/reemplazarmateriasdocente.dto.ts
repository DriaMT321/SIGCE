import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class dtoreemplazarmateriasdocente {
  @IsUUID()
  courseId!: string;

  @IsUUID()
  teacherId!: string;

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  subjectIds!: string[];
}
