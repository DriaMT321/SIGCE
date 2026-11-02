import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pantallaacceso.dart';
import '../../features/auth/presentation/pantallaactivacionestudiante.dart';
import '../auth/estadosesionautenticacion.dart';
import '../../features/students/presentation/pantallaestudiantes.dart';
import '../../features/grades/presentation/pantallacalificaciones.dart';
import '../../features/attendance/presentation/pantallaasistencia.dart';
import '../../features/alerts/presentation/pantallaalertas.dart';
import '../../features/profile/presentation/pantallaperfil.dart';

final GoRouter enrutadoraplicacion = GoRouter(
  initialLocation: '/login',
  refreshListenable: estadodesionautenticacion.instance,
  redirect: (contexto, estado) async {
    final tienesesion = estadodesionautenticacion.instance.tienesesion;
    final estaenpantalladeacceso = estado.matchedLocation == '/login';
    final estaenactivacionestudiante =
        estado.matchedLocation == '/activate-student';
    if (!tienesesion &&
        !estaenpantalladeacceso &&
        !estaenactivacionestudiante) {
      return '/login';
    }
    if (tienesesion && (estaenpantalladeacceso || estaenactivacionestudiante)) {
      return '/students';
    }
    return null;
  },
  routes: <RouteBase>[
    GoRoute(
      path: '/login',
      builder: (BuildContext contexto, GoRouterState estado) {
        return const pantallaacceso();
      },
    ),
    GoRoute(
      path: '/activate-student',
      builder: (BuildContext contexto, GoRouterState estado) {
        return const pantallaactivacionestudiante();
      },
    ),
    GoRoute(
      path: '/students',
      builder: (BuildContext contexto, GoRouterState estado) {
        return const pantallaestudiantes();
      },
    ),
    GoRoute(
      path: '/students/:studentId/grades',
      builder: (BuildContext contexto, GoRouterState estado) {
        return pantallacalificaciones(
          identificadorestudiante: estado.pathParameters['studentId']!,
        );
      },
    ),
    GoRoute(
      path: '/students/:studentId/attendance',
      builder: (BuildContext contexto, GoRouterState estado) {
        return pantallaasistencia(
          identificadorestudiante: estado.pathParameters['studentId']!,
        );
      },
    ),
    GoRoute(
      path: '/alerts',
      builder: (BuildContext contexto, GoRouterState estado) {
        return const pantallaalertas();
      },
    ),
    GoRoute(
      path: '/profile',
      builder: (BuildContext contexto, GoRouterState estado) {
        return const pantallaperfil();
      },
    ),
  ],
);
