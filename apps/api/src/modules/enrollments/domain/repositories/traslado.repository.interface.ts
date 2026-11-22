import { SolicitudTrasladoEstudiantil, dtocreartraslado, dtoactualizarfasetraslado, dtofiltrosstraslados } from '@academic/shared-types';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export const tokenrepositoriotraslados = Symbol('STUDENT_TRANSFER_REPOSITORY');

export interface repositoriotraslados {
  buscartodos(filtros: dtofiltrosstraslados): Promise<{ items: SolicitudTrasladoEstudiantil[]; total: number }>;
  buscarporid(id: string): Promise<SolicitudTrasladoEstudiantil | null>;
  buscarporstudent(studentId: string, academicYearId?: string): Promise<SolicitudTrasladoEstudiantil[]>;
  crear(datos: dtocreartraslado, auditoria: auditoriacontexto): Promise<SolicitudTrasladoEstudiantil>;
  actualizarfase(id: string, datos: dtoactualizarfasetraslado, auditoria: auditoriacontexto): Promise<SolicitudTrasladoEstudiantil>;
}
