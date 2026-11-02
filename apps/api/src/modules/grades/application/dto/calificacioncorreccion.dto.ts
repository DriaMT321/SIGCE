export class dtosolicitarcorreccioncalificacion {
  gradeId: string;

  proposedValue: number;

  reason: string;

  evidenceReference: string;
}

export class dtodecidircorreccioncalificacion {
  approve: boolean;

  decisionReason: string;
}
