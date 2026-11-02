import { consultasinformes } from '../../features/reports/infrastructure/adaptadorconsultasdeinformes';
import { InformesPagina } from '../../features/reports/pages/paginainformes';

export function informesruta() {
  return <InformesPagina queries={consultasinformes} />;
}
