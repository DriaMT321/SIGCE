import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_app/core/network/clienteapi.dart';
import 'package:mobile_app/core/storage/servicioalmacenamientoseguro.dart';
import 'package:mobile_app/core/theme/temaaplicacion.dart';
import 'package:mobile_app/features/academic/data/academic_repository.dart';
import 'package:mobile_app/features/academic/domain/entities/registrosacademicos.dart';
import 'package:mobile_app/features/academic/domain/exceptions/excepcionacademica.dart';
import 'package:mobile_app/features/attendance/presentation/pantallaasistencia.dart';
import 'package:mobile_app/features/grades/presentation/pantallacalificaciones.dart';
import 'package:mobile_app/features/students/presentation/pantallaestudiantes.dart';

class _repositoriofamiliar extends AcademicRepository {
  _repositoriofamiliar() : super(clienteapi(seguroalmacenamientoservicio()));

  final estudiantescalificacionesolicitados = <String>[];
  final estudiantesasistenciasolicitados = <String>[];
  bool fallarprimerasolicitudestudiante = false;
  bool calificacionesoffline = false;
  int solicitudesestudiantes = 0;
  bool periodossinconexion = false;
  bool periodosdenegados = false;

  @override
  Future<resultadoencache<List<periodoacademico>>>
  obtenerperiodosencache() async {
    if (periodossinconexion || periodosdenegados) {
      throw DioException(
        requestOptions: RequestOptions(path: '/periods'),
        type: periodosdenegados
            ? DioExceptionType.badResponse
            : DioExceptionType.connectionError,
      );
    }
    return resultadoencache(
      datos: [
        periodoacademico(
          identificador: 'p2025',
          nombre: 'Primer trimestre',
          gestionid: 'y2025',
          gestion: 2025,
          gestionactiva: false,
          inicio: DateTime.utc(2025, 1, 1),
          fin: DateTime.utc(2025, 12, 31),
        ),
        periodoacademico(
          identificador: 'p1',
          nombre: 'Primer trimestre',
          gestionid: 'y2026',
          gestion: 2026,
          gestionactiva: true,
          inicio: DateTime.utc(2026, 1, 1),
          fin: DateTime.utc(2026, 4, 30),
        ),
        periodoacademico(
          identificador: 'p2',
          nombre: 'Segundo trimestre',
          gestionid: 'y2026',
          gestion: 2026,
          gestionactiva: true,
          inicio: DateTime.utc(2026, 5, 1),
          fin: DateTime.utc(2026, 8, 31),
        ),
        periodoacademico(
          identificador: 'p3',
          nombre: 'Tercer trimestre',
          gestionid: 'y2026',
          gestion: 2026,
          gestionactiva: true,
          inicio: DateTime.utc(2026, 9, 1),
          fin: DateTime.utc(2026, 12, 31),
        ),
      ],
      estaoffline: false,
    );
  }

  @override
  Future<List<resumendeestudiante>> obtenerestudiantes() async {
    solicitudesestudiantes++;
    if (fallarprimerasolicitudestudiante && solicitudesestudiantes == 1) {
      throw const excepcionacademica('Error de red');
    }
    return [
      const resumendeestudiante(
        identificador: 'child-a',
        nombre: 'Ana Rojas',
        rude: 'SIM-001',
        nombrecurso: 'Primero A',
      ),
      const resumendeestudiante(
        identificador: 'child-b',
        nombre: 'Luis Rojas',
        rude: 'SIM-002',
        nombrecurso: 'Segundo B',
      ),
    ];
  }

  @override
  Future<resultadoencache<List<resumendeestudiante>>>
  obtenerestudiantesencache() async => resultadoencache(
    datos: await obtenerestudiantes(),
    estaoffline: false,
    fechaencache: DateTime(2026, 10, 22),
  );

  @override
  Future<resultadoencache<List<resumendecalificacion>>> getGradesWithCache({
    String? identificadorestudiante,
  }) async {
    estudiantescalificacionesolicitados.add(identificadorestudiante ?? '');
    return resultadoencache(
      datos: [
        resumendecalificacion(
          materia: identificadorestudiante == 'child-a'
              ? 'Matemática'
              : 'Lenguaje',
          periodo: 'Primer trimestre',
          identificadorperiodo: 'p1',
          valor: 85,
          nombreestudiante: identificadorestudiante == 'child-a'
              ? 'Ana Rojas'
              : 'Luis Rojas',
        ),
        const resumendecalificacion(
          materia: 'Historia anterior',
          periodo: 'Primer trimestre',
          identificadorperiodo: 'p2025',
          valor: 72,
          nombreestudiante: 'Ana Rojas',
        ),
      ],
      estaoffline: calificacionesoffline,
      fechaencache: calificacionesoffline
          ? DateTime(2026, 10, 15, 8, 30)
          : null,
    );
  }

  @override
  Future<List<resumendeasistencia>> obtenerasistencia({
    String? identificadorestudiante,
  }) async {
    estudiantesasistenciasolicitados.add(identificadorestudiante ?? '');
    return [
      resumendeasistencia(
        fecha: DateTime(2026, 10, 15),
        estado: 'PRESENT',
        identificadorgestion: 'y2026',
        nombreestudiante: identificadorestudiante == 'child-a'
            ? 'Ana Rojas'
            : 'Luis Rojas',
      ),
      resumendeasistencia(
        fecha: DateTime.utc(2026, 10, 16),
        estado: 'ABSENT',
        nombreestudiante: 'Ana Rojas',
        identificadorgestion: 'y2026',
      ),
      resumendeasistencia(
        fecha: DateTime.utc(2026, 10, 17),
        estado: 'JUSTIFIED',
        nombreestudiante: 'Ana Rojas',
        identificadorgestion: 'y2026',
        justificacion: 'Cita médica',
      ),
      resumendeasistencia(
        fecha: DateTime.utc(2026, 6, 10),
        estado: 'ABSENT',
        nombreestudiante: 'Ana Rojas',
        identificadorgestion: 'y2026',
      ),
      resumendeasistencia(
        fecha: DateTime.utc(2025, 6, 10),
        estado: 'ABSENT',
        nombreestudiante: 'Ana Rojas',
        identificadorgestion: 'y2025',
      ),
    ];
  }

  @override
  Future<resultadoencache<List<resumendeasistencia>>> obtenerasistenciaencache({
    String? identificadorestudiante,
  }) async => resultadoencache(
    datos: await obtenerasistencia(
      identificadorestudiante: identificadorestudiante,
    ),
    estaoffline: false,
    fechaencache: DateTime(2026, 10, 22),
  );
}

GoRouter _enrutadorpara(_repositoriofamiliar repositorio) => GoRouter(
  initialLocation: '/students',
  routes: [
    GoRoute(
      path: '/students',
      builder: (_, __) => pantallaestudiantes(repositorio: repositorio),
    ),
    GoRoute(
      path: '/students/:studentId/grades',
      builder: (_, state) => pantallacalificaciones(
        identificadorestudiante: state.pathParameters['studentId']!,
        repositorio: repositorio,
      ),
    ),
    GoRoute(
      path: '/students/:studentId/attendance',
      builder: (_, state) => pantallaasistencia(
        identificadorestudiante: state.pathParameters['studentId']!,
        repositorio: repositorio,
      ),
    ),
  ],
);

Future<void> _verificaraccesibilidad(WidgetTester probador) async {
  await expectLater(probador, meetsGuideline(textContrastGuideline));
  await expectLater(probador, meetsGuideline(androidTapTargetGuideline));
  await expectLater(probador, meetsGuideline(iOSTapTargetGuideline));
  await expectLater(probador, meetsGuideline(labeledTapTargetGuideline));
}

void main() {
  testWidgets(
    'abre las notas del hijo seleccionado sin mezclar identificadores',
    (tester) async {
      final repositorio = _repositoriofamiliar();
      final enrutador = _enrutadorpara(repositorio);
      addTearDown(enrutador.dispose);

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp.router(
            theme: temaaplicacion.temaclara,
            routerConfig: enrutador,
          ),
        ),
      );
      await tester.pumpAndSettle();
      await _verificaraccesibilidad(tester);
      expect(find.text('Ana Rojas'), findsOneWidget);
      expect(find.text('Luis Rojas'), findsOneWidget);

      await tester.tap(
        find.widgetWithText(OutlinedButton, 'Calificaciones').first,
      );
      await tester.pumpAndSettle();
      await _verificaraccesibilidad(tester);

      expect(repositorio.estudiantescalificacionesolicitados, ['child-a']);
      expect(find.text('Matemática'), findsOneWidget);
      expect(find.textContaining('Luis Rojas'), findsNothing);
    },
  );

  testWidgets('abre la asistencia del hijo seleccionado', (tester) async {
    final repositorio = _repositoriofamiliar();
    final enrutador = _enrutadorpara(repositorio);
    addTearDown(enrutador.dispose);

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp.router(
          theme: temaaplicacion.temaclara,
          routerConfig: enrutador,
        ),
      ),
    );
    await tester.pumpAndSettle();
    await _verificaraccesibilidad(tester);
    await tester.tap(find.widgetWithText(OutlinedButton, 'Asistencia').first);
    await tester.pumpAndSettle();

    expect(repositorio.estudiantesasistenciasolicitados, ['child-a']);
    expect(find.text('15/10/2026'), findsOneWidget);
    expect(find.text('PRESENTE'), findsOneWidget);
    expect(find.text('Ausencias registradas: 2'), findsOneWidget);
    expect(find.text('Justificadas: 1'), findsOneWidget);
    await tester.tap(find.text('Tercer trimestre · 2026'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Segundo trimestre · 2026').last);
    await tester.pumpAndSettle();
    expect(find.text('10/06/2026'), findsOneWidget);
    expect(find.text('15/10/2026'), findsNothing);
    expect(find.text('Ausencias registradas: 1'), findsOneWidget);
  });

  testWidgets('permite consultar calificaciones de una gestión anterior', (
    tester,
  ) async {
    final repositorio = _repositoriofamiliar();
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: temaaplicacion.temaclara,
          home: pantallacalificaciones(
            identificadorestudiante: 'child-a',
            repositorio: repositorio,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Matemática'), findsOneWidget);
    expect(find.text('Historia anterior'), findsNothing);
    await tester.tap(find.text('2026'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('2025').last);
    await tester.pumpAndSettle();
    expect(find.text('Historia anterior'), findsOneWidget);
    expect(find.text('Matemática'), findsNothing);
  });

  testWidgets('sin caché de períodos conserva las notas sin clasificarlas', (
    tester,
  ) async {
    final repositorio = _repositoriofamiliar()..periodossinconexion = true;
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: temaaplicacion.temaclara,
          home: pantallacalificaciones(
            identificadorestudiante: 'child-a',
            repositorio: repositorio,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Sin gestión identificada'), findsOneWidget);
    expect(find.text('Matemática'), findsOneWidget);
    expect(find.text('Historia anterior'), findsOneWidget);
  });

  testWidgets(
    'un rechazo del servidor al catálogo no se presenta como desconexión',
    (tester) async {
      final repositorio = _repositoriofamiliar()..periodosdenegados = true;
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: temaaplicacion.temaclara,
            home: pantallacalificaciones(
              identificadorestudiante: 'child-a',
              repositorio: repositorio,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(
        find.text('No se pudieron cargar las calificaciones.'),
        findsOneWidget,
      );
      expect(find.text('Matemática'), findsNothing);
    },
  );

  testWidgets('permite reintentar la lista familiar tras un error', (
    tester,
  ) async {
    final repositorio = _repositoriofamiliar()
      ..fallarprimerasolicitudestudiante = true;
    final enrutador = _enrutadorpara(repositorio);
    addTearDown(enrutador.dispose);

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp.router(
          theme: temaaplicacion.temaclara,
          routerConfig: enrutador,
        ),
      ),
    );
    await tester.pumpAndSettle();
    await _verificaraccesibilidad(tester);
    expect(find.text('No se pudo cargar la información.'), findsOneWidget);

    await tester.tap(find.text('Reintentar'));
    await tester.pumpAndSettle();
    await _verificaraccesibilidad(tester);

    expect(repositorio.solicitudesestudiantes, 2);
    expect(find.text('Ana Rojas'), findsOneWidget);
  });

  testWidgets(
    'identifica las notas guardadas y muestra cuándo se actualizaron',
    (tester) async {
      final repositorio = _repositoriofamiliar()..calificacionesoffline = true;

      await tester.pumpWidget(
        MaterialApp(
          theme: temaaplicacion.temaclara,
          home: pantallacalificaciones(
            identificadorestudiante: 'child-a',
            repositorio: repositorio,
          ),
        ),
      );
      await tester.pumpAndSettle();
      await _verificaraccesibilidad(tester);

      expect(repositorio.estudiantescalificacionesolicitados, ['child-a']);
      expect(find.text('Matemática'), findsOneWidget);
      expect(
        find.text('Modo sin conexión · Actualizado al 15/10/2026 08:30'),
        findsOneWidget,
      );
    },
  );
}
