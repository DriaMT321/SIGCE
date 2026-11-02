export class dtocrearanioacademico {
  year: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export class dtoactualizaranioacademico {
  year?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  isClosed?: boolean;
}
