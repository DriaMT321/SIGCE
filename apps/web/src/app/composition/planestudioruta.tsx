import { instanciaplanificacioncurricular } from '../../features/curriculum/infrastructure/adaptadorplanificacioncurricular';
import { CurriculoPagina } from '../../features/curriculum/pages/paginaplanestudio';

export function curriculoruta() {
  return <CurriculoPagina planning={instanciaplanificacioncurricular} />;
}
