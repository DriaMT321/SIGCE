import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/network/clienteapi.dart';
import 'package:mobile_app/core/storage/servicioalmacenamientoseguro.dart';
import 'package:mobile_app/core/theme/temaaplicacion.dart';
import 'package:mobile_app/features/academic/data/academic_repository.dart';
import 'package:mobile_app/features/academic/domain/entities/registrosacademicos.dart';
import 'package:mobile_app/features/academic/domain/exceptions/excepcionacademica.dart';
import 'package:mobile_app/features/alerts/presentation/pantallaalertas.dart';

class _repositorioalertas extends AcademicRepository {
  _repositorioalertas() : super(clienteapi(seguroalmacenamientoservicio()));

  resultadoencache<List<resumendealerta>> resultado = resultadoencache(
    datos: [
      resumendealerta(
        titulo: 'Calificación por debajo del mínimo',
        mensaje: 'Ana obtuvo 48/100 en Matemática.',
        gravedad: 'WARNING',
        fechacreacion: DateTime(2026, 10, 22),
        estaleida: false,
      ),
    ],
    estaoffline: false,
    fechaencache: null,
  );
  bool debefallar = false;
  int solicitudes = 0;

  @override
  Future<resultadoencache<List<resumendealerta>>>
  obteneralertasencache() async {
    solicitudes++;
    if (debefallar) throw const excepcionacademica('Error de red');
    return resultado;
  }
}

void main() {
  Widget construirpantalla(_repositorioalertas repositorio) => ProviderScope(
    child: MaterialApp(
      theme: temaaplicacion.temaclara,
      home: pantallaalertas(repositorio: repositorio),
    ),
  );

  testWidgets('muestra la alerta devuelta para el usuario autenticado', (
    tester,
  ) async {
    final repositorio = _repositorioalertas();

    await tester.pumpWidget(construirpantalla(repositorio));
    await tester.pumpAndSettle();

    expect(repositorio.solicitudes, 1);
    expect(find.text('Calificación por debajo del mínimo'), findsOneWidget);
    expect(find.text('Ana obtuvo 48/100 en Matemática.'), findsOneWidget);
    expect(find.text('Atención'), findsOneWidget);
  });

  testWidgets(
    'mantiene y marca la fecha de las alertas disponibles sin conexión',
    (tester) async {
      final repositorio = _repositorioalertas()
        ..resultado = resultadoencache(
          datos: [
            resumendealerta(
              titulo: 'Inasistencias reiteradas',
              mensaje: 'Ana registra tres faltas.',
              gravedad: 'DANGER',
              fechacreacion: DateTime(2026, 10, 20),
              estaleida: false,
            ),
          ],
          estaoffline: true,
          fechaencache: DateTime(2026, 10, 21, 9, 5),
        );

      await tester.pumpWidget(construirpantalla(repositorio));
      await tester.pumpAndSettle();

      expect(
        find.text('Modo sin conexión · Actualizado al 21/10/2026 09:05'),
        findsOneWidget,
      );
      expect(find.text('Inasistencias reiteradas'), findsOneWidget);
      expect(find.text('Importante'), findsOneWidget);
    },
  );

  testWidgets('permite reintentar después de un error de conectividad', (
    tester,
  ) async {
    final repositorio = _repositorioalertas()..debefallar = true;

    await tester.pumpWidget(construirpantalla(repositorio));
    await tester.pumpAndSettle();
    expect(find.text('No se pudieron cargar las alertas.'), findsOneWidget);

    repositorio.debefallar = false;
    await tester.tap(find.text('Reintentar'));
    await tester.pumpAndSettle();

    expect(repositorio.solicitudes, 2);
    expect(find.text('Calificación por debajo del mínimo'), findsOneWidget);
  });

  testWidgets('mantiene contraste y objetivos táctiles accesibles', (
    tester,
  ) async {
    await tester.pumpWidget(construirpantalla(_repositorioalertas()));
    await tester.pumpAndSettle();

    await expectLater(tester, meetsGuideline(textContrastGuideline));
    await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
    await expectLater(tester, meetsGuideline(iOSTapTargetGuideline));
    await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
  });
}
