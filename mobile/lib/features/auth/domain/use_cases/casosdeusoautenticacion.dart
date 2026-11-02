import 'dart:convert';

import '../excepcionautenticacion.dart';
import '../puertoautenticacion.dart';

class casodeusoiniciarsesion {
  const casodeusoiniciarsesion(this._autenticacion);

  static const rolespermitidos = {
    'STUDENT',
    'TEACHER',
    'FAMILY',
    'ADMINISTRATIVE',
  };
  final puertodeautenticacion _autenticacion;

  Future<void> ejecutar({
    required String role,
    required String identifier,
    String? secret,
    String? identificadorsecundario,
  }) async {
    final normalizedrol = role.trim().toUpperCase();
    final normalizedidentificador = identifier.trim();
    if (!rolespermitidos.contains(normalizedrol)) {
      throw const excepcionautenticacion('El tipo de usuario no es válido.');
    }
    if (normalizedidentificador.isEmpty) {
      throw const excepcionautenticacion(
        'Ingresa el identificador solicitado.',
      );
    }
    if (secret == null || secret.isEmpty) {
      throw const excepcionautenticacion('Ingresa tu clave.');
    }
    final normalizedsecundarioidentificador = identificadorsecundario?.trim();
    if (normalizedrol == 'FAMILY' &&
        (normalizedsecundarioidentificador == null ||
            normalizedsecundarioidentificador.isEmpty)) {
      throw const excepcionautenticacion(
        'Ingresa el número de celular registrado.',
      );
    }

    await _autenticacion.iniciarsesion(
      role: normalizedrol,
      identifier: normalizedidentificador,
      secret: secret,
      identificadorsecundario: normalizedsecundarioidentificador,
    );
  }
}

class casodeusoactivarestudiante {
  const casodeusoactivarestudiante(this._autenticacion);

  final puertodeautenticacion _autenticacion;

  Future<void> ejecutar({
    required String activationToken,
    required String clavenueva,
  }) async {
    final token = activationToken.trim();
    final clavelength = utf8.encode(clavenueva).length;
    if (token.length < 32 || token.length > 100) {
      throw const excepcionautenticacion(
        'El código de activación no es válido.',
      );
    }
    if (clavenueva.trim().isEmpty ||
        clavenueva.runes.length < 12 ||
        clavelength > 72) {
      throw const excepcionautenticacion(
        'Clave inválida: no uses solo espacios; mínimo 12 caracteres y máximo 72 bytes UTF-8.',
      );
    }
    await _autenticacion.activarcuentaestudiante(
      activationToken: token,
      clavenueva: clavenueva,
    );
  }
}

class casodeusocerrarsesion {
  const casodeusocerrarsesion(this._autenticacion);

  final puertodeautenticacion _autenticacion;

  Future<void> ejecutar() => _autenticacion.cerrarsesion();
}

class casodeusoobtenerperfilusuarioactual {
  const casodeusoobtenerperfilusuarioactual(this._autenticacion);

  final puertodeautenticacion _autenticacion;

  Future<perfilusuarioactual?> ejecutar() =>
      _autenticacion.obtenerperfilusuarioactual();
}
