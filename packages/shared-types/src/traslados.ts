import {
  tipotraslado,
  direcciontraslado,
  causaltraslado,
  fasetraslado,
  estadotraslado,
} from '@academic/domain-kernel';

export interface ChecklistDocumentalTraslado {
  formularioTrasladoFirmado: boolean;
  certificadoNacimiento: boolean;
  cedulaIdentidadEstudiante: boolean;
  cedulaIdentidadTutor: boolean;
  libretaEscolarBoletin: boolean;
  formularioRudeTransferencia: boolean;
  carnetVacunas: boolean;
  respaldoJustificativo: boolean;
}

export interface CalificacionSnapshotItem {
  subjectId: string;
  subjectName: string;
  firstTrimester?: number | null;
  secondTrimester?: number | null;
  thirdTrimester?: number | null;
  average?: number | null;
}

export interface SolicitudTrasladoEstudiantil {
  id: string;
  enrollmentId?: string | null;
  studentId: string;
  academicYearId: string;
  direction: direcciontraslado;
  transferType: tipotraslado;
  causal: causaltraslado;
  causalDetails?: string | null;
  originSchool: string;
  originSieCode?: string | null;
  destinationSchool: string;
  destinationSieCode?: string | null;
  destinationDistrict?: string | null;
  destinationDepartment?: string | null;
  targetGradeCourse?: string | null;
  currentTrimester: number;
  gradesSnapshot?: CalificacionSnapshotItem[] | null;
  phase: fasetraslado;
  status: estadotraslado;
  distritalResolution?: string | null;
  distritalApprovalDate?: string | Date | null;
  sieSyncDeadline?: string | Date | null;
  sieSyncCompletedAt?: string | Date | null;
  sieFolioNumber?: string | null;
  documentsChecklist?: ChecklistDocumentalTraslado | null;
  antiCoercionCertified: boolean;
  solicitanteNombre?: string | null;
  solicitanteCi?: string | null;
  solicitanteParentesco?: string | null;
  solicitanteTelefono?: string | null;
  observations?: string | null;
  createdByUserId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: {
    id: string;
    rude: string;
    ci: string;
    firstName: string;
    lastName: string;
  };
}

export interface dtocreartraslado {
  studentId: string;
  enrollmentId?: string;
  academicYearId: string;
  direction: direcciontraslado;
  transferType: tipotraslado;
  causal: causaltraslado;
  causalDetails?: string;
  originSchool: string;
  originSieCode?: string;
  destinationSchool: string;
  destinationSieCode?: string;
  destinationDistrict?: string;
  destinationDepartment?: string;
  targetGradeCourse?: string;
  currentTrimester?: number;
  documentsChecklist?: Partial<ChecklistDocumentalTraslado>;
  antiCoercionCertified: boolean;
  solicitanteNombre?: string;
  solicitanteCi?: string;
  solicitanteParentesco?: string;
  solicitanteTelefono?: string;
  observations?: string;
}

export interface dtoactualizarfasetraslado {
  phase: fasetraslado;
  status?: estadotraslado;
  distritalResolution?: string;
  distritalApprovalDate?: string | Date;
  sieFolioNumber?: string;
  sieSyncCompleted?: boolean;
  documentsChecklist?: Partial<ChecklistDocumentalTraslado>;
  observations?: string;
}

export interface dtofiltrosstraslados {
  studentId?: string;
  academicYearId?: string;
  direction?: direcciontraslado;
  transferType?: tipotraslado;
  status?: estadotraslado;
  phase?: fasetraslado;
  search?: string;
  limit?: number;
  offset?: number;
}
