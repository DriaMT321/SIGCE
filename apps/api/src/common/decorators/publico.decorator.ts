import { SetMetadata } from '@nestjs/common';

export const constanteclavepublica = 'isPublic';
export const publico = () => SetMetadata(constanteclavepublica, true);
