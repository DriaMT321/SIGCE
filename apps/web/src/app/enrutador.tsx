import { createElement, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { TableroDisposicion } from '../components/layout/estructurapanel';
import { RutaCarga } from '../components/feedback/indicadordecarga';
import { pagina404 } from '../components/feedback/pagina404';

const SesionPagina = lazy(() =>
  import('../features/auth/pages/paginaacceso').then((modulo) => ({
    default: modulo.SesionPagina,
  })),
);
const EstudianteActivacionPagina = lazy(() =>
  import('../features/auth/pages/paginaactivacionestudiante').then((modulo) => ({
    default: modulo.EstudianteActivacionPagina,
  })),
);
const TableroResumenPagina = lazy(() =>
  import('./composition/panelruta').then((modulo) => ({
    default: modulo.tableroruta,
  })),
);
const Paneldesincronizacionsie = lazy(() =>
  import('./composition/sincronizacionsieruta').then((modulo) => ({
    default: modulo.siesincronizacionruta,
  })),
);
const EstudiantesPagina = lazy(() =>
  import('./composition/estudiantesruta').then((modulo) => ({
    default: modulo.estudiantesruta,
  })),
);
const CursosPagina = lazy(() =>
  import('./composition/cursosruta').then((modulo) => ({
    default: modulo.cursosruta,
  })),
);
const CalificacionesPagina = lazy(() =>
  import('./composition/calificacionesruta').then((modulo) => ({
    default: modulo.calificacionesruta,
  })),
);
const AsistenciaPagina = lazy(() =>
  import('./composition/asistenciasruta').then((modulo) => ({
    default: modulo.asistenciaruta,
  })),
);
const AuditoriaPagina = lazy(() =>
  import('./composition/auditoriaruta').then((modulo) => ({ default: modulo.auditoriaruta })),
);
const InformesPagina = lazy(() =>
  import('./composition/informesruta').then((modulo) => ({
    default: modulo.informesruta,
  })),
);
const InscripcionesPagina = lazy(() =>
  import('./composition/matriculasruta').then((modulo) => ({
    default: modulo.inscripcionesruta,
  })),
);
const HorariosPagina = lazy(() =>
  import('./composition/horariosruta').then((modulo) => ({ default: modulo.horariosruta })),
);
const CurriculoPagina = lazy(() =>
  import('./composition/planestudioruta').then((modulo) => ({
    default: modulo.curriculoruta,
  })),
);
const AsignacionesPagina = lazy(() =>
  import('./composition/asignacionesruta').then((modulo) => ({
    default: modulo.asignacionesruta,
  })),
);
const EventosAcademicosPagina = lazy(() =>
  import('./composition/eventosacademicosruta').then((modulo) => ({
    default: modulo.eventosacademicosruta,
  })),
);
const ComunidadRuta = lazy(() =>
  import('./composition/comunidadruta').then((modulo) => ({
    default: modulo.ComunidadRuta,
  })),
);
const AlertasPagina = lazy(() =>
  import('./composition/alertasruta').then((modulo) => ({ default: modulo.alertasruta })),
);
const AnunciosPagina = lazy(() =>
  import('./composition/anunciosruta').then((modulo) => ({
    default: modulo.anunciosruta,
  })),
);
const UsuariosPagina = lazy(() =>
  import('./composition/usuariosruta').then((modulo) => ({ default: modulo.usuariosruta })),
);

export const enrutador = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<RutaCarga />}>
        <SesionPagina />
      </Suspense>
    ),
  },
  {
    path: '/student/activate',
    element: (
      <Suspense fallback={<RutaCarga />}>
        <EstudianteActivacionPagina />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: <TableroDisposicion />,
    children: [
      {
        index: true,
        element: <TableroResumenPagina />,
      },
      {
        path: 'sie-sync',
        element: <Paneldesincronizacionsie />,
      },
      {
        path: 'students',
        element: <EstudiantesPagina />,
      },
      {
        path: 'courses',
        element: <CursosPagina />,
      },
      {
        path: 'schedules',
        element: <HorariosPagina />,
      },
      {
        path: 'curriculum',
        element: <CurriculoPagina />,
      },
      {
        path: 'assignments',
        element: <AsignacionesPagina />,
      },
      {
        path: 'academic-events',
        element: <EventosAcademicosPagina />,
      },
      {
        path: 'enrollments',
        element: <InscripcionesPagina />,
      },
      {
        path: 'teachers',
        element: <ComunidadRuta mode="teachers" />,
      },
      {
        path: 'parents',
        element: <ComunidadRuta mode="parents" />,
      },
      {
        path: 'alerts',
        element: <AlertasPagina />,
      },
      {
        path: 'announcements',
        element: <AnunciosPagina />,
      },
      {
        path: 'grades',
        element: <CalificacionesPagina />,
      },
      {
        path: 'attendance',
        element: <AsistenciaPagina />,
      },
      {
        path: 'audit',
        element: <AuditoriaPagina />,
      },
      {
        path: 'reports',
        element: <InformesPagina />,
      },
      {
        path: 'users',
        element: <UsuariosPagina />,
      },
    ],
  },
  {
    path: '*',
    element: createElement(pagina404),
  },
]);
