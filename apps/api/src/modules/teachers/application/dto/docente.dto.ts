export class dtocreardocente {
  email: string;

  password: string;

  ci: string;

  firstName: string;

  lastName: string;

  specialty: string;

  phone?: string;

  itemNumber?: string;

  rdaNumber?: string;

  escalafonCategory?: string;

  yearsOfService?: number;

  photoUrl?: string;

  documents?: Record<string, unknown>;
}

export class dtoactualizardocente {
  email?: string;

  ci?: string;

  firstName?: string;

  lastName?: string;

  specialty?: string;

  phone?: string;

  itemNumber?: string;

  rdaNumber?: string;

  escalafonCategory?: string;

  yearsOfService?: number;

  photoUrl?: string;

  documents?: Record<string, unknown>;
}
