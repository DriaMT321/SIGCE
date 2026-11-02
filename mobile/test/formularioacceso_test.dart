import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/theme/temaaplicacion.dart';
import 'package:mobile_app/features/auth/presentation/pantallaacceso.dart';

Future<void> _verificaraccesibilidad(WidgetTester probador) async {
  await expectLater(probador, meetsGuideline(textContrastGuideline));
  await expectLater(probador, meetsGuideline(androidTapTargetGuideline));
  await expectLater(probador, meetsGuideline(iOSTapTargetGuideline));
  await expectLater(probador, meetsGuideline(labeledTapTargetGuideline));
}

void main() {
  testWidgets(
    'pide código y clave antes de intentar el acceso administrativo',
    (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: temaaplicacion.temaclara,
            home: const pantallaacceso(),
          ),
        ),
      );
      await tester.ensureVisible(find.text('Ingresar al sistema'));
      await tester.tap(find.text('Ingresar al sistema'));
      await tester.pump();
      await _verificaraccesibilidad(tester);

      expect(find.text('Ingresa el identificador solicitado.'), findsOneWidget);
      expect(
        find.text('La clave debe tener al menos 6 caracteres.'),
        findsOneWidget,
      );
    },
  );

  testWidgets('muestra CI, celular y clave para el acceso familiar', (
    tester,
  ) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: temaaplicacion.temaclara,
          home: const pantallaacceso(),
        ),
      ),
    );
    await tester.tap(find.text('Familiar'));
    await tester.pump();
    await _verificaraccesibilidad(tester);

    expect(find.text('Cédula de identidad'), findsOneWidget);
    expect(find.text('Número de celular'), findsOneWidget);
    expect(find.text('Clave'), findsOneWidget);
  });

  testWidgets('exige la clave también para el acceso estudiantil', (
    tester,
  ) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: temaaplicacion.temaclara,
          home: const pantallaacceso(),
        ),
      ),
    );
    await tester.tap(find.text('Estudiante'));
    await tester.pump();
    await _verificaraccesibilidad(tester);

    expect(find.text('Código de alumno'), findsOneWidget);
    expect(find.text('Clave'), findsOneWidget);
    await tester.ensureVisible(find.text('Ingresar al sistema'));
    await tester.tap(find.text('Ingresar al sistema'));
    await tester.pump();
    expect(
      find.text('La clave debe tener al menos 6 caracteres.'),
      findsOneWidget,
    );
  });
}
