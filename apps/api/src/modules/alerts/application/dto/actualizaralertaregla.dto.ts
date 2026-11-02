export class dtoactualizarreglaalerta {
  enabled: boolean;

  severity: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';

  gradeThreshold?: number;

  absenceThreshold?: number;

  absenceWindowDays?: number;
}
