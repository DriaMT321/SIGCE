import { auditoriaconsultas } from '../../features/audit/infrastructure/adaptadorconsultasauditoria';
import { AuditoriaPagina } from '../../features/audit/pages/paginaauditoria';

export function auditoriaruta() {
  return <AuditoriaPagina queries={auditoriaconsultas} />;
}
