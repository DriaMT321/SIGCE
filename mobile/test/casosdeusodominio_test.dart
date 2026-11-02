import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/features/academic/domain/policies/politicacalificacion.dart';
import 'package:mobile_app/features/auth/domain/excepcionautenticacion.dart';
import 'package:mobile_app/features/auth/domain/puertoautenticacion.dart';
import 'package:mobile_app/features/auth/domain/use_cases/casosdeusoautenticacion.dart';

class _puertoautenticacionprueba implements puertodeautenticacion {
  String? rol;
  String? identificador;
  String? secundarioidentificador;
  int llamadasiniciarsesion = 0;
  int llamadasactivacion = 0;

  @override
  Future<void> activarcuentaestudiante({
    required String activationToken,
    required String clavenueva,
  }) async {
    llamadasactivacion++;
  }

  @override
  Future<perfilusuarioactual?> obtenerperfilusuarioactual() async => null;

  @override
  Future<void> iniciarsesion({
    required String role,
    required String identifier,
    String? secret,
    String? identificadorsecundario,
  }) async {
    llamadasiniciarsesion++;
    rol = role;
    identificador = identifier;
    secundarioidentificador = identificadorsecundario;
  }

  @override
  Future<void> cerrarsesion() async {}
}

void main() {
  test('applies the passing threshold in the domain policy', () {
    expect(politicanotas.estaaprobada(50), isFalse);
    expect(politicanotas.estaaprobada(51), isTrue);
  });

  test(
    'normalizes and validates role-based login input before calling data',
    () async {
      final gateway = _puertoautenticacionprueba();
      final usecase = casodeusoiniciarsesion(gateway);

      await usecase.ejecutar(
        role: ' family ',
        identifier: ' 1234567 ',
        secret: 'clave-segura',
        identificadorsecundario: ' 7654321 ',
      );

      expect(gateway.rol, 'FAMILY');
      expect(gateway.identificador, '1234567');
      expect(gateway.secundarioidentificador, '7654321');
      expect(gateway.llamadasiniciarsesion, 1);
    },
  );

  test(
    'rejects family login without the registered phone before data access',
    () async {
      final gateway = _puertoautenticacionprueba();

      await expectLater(
        casodeusoiniciarsesion(gateway).ejecutar(
          role: 'FAMILY',
          identifier: '1234567',
          secret: 'clave-segura',
        ),
        throwsA(isA<excepcionautenticacion>()),
      );

      expect(gateway.llamadasiniciarsesion, 0);
    },
  );

  test(
    'rejects a whitespace-only activation password before data access',
    () async {
      final gateway = _puertoautenticacionprueba();

      await expectLater(
        casodeusoactivarestudiante(gateway)
            .ejecutar(activationToken: 'a' * 32, clavenueva: '\u0085' * 12),
        throwsA(isA<excepcionautenticacion>()),
      );

      expect(gateway.llamadasactivacion, 0);
    },
  );
}
