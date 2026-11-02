import 'dart:convert';

import 'package:dio/dio.dart';

import '../../../core/auth/estadosesionautenticacion.dart';
import '../../../core/network/clienteapi.dart';
import '../../../core/storage/servicioalmacenamientoseguro.dart';
import '../domain/excepcionautenticacion.dart';
import '../domain/puertoautenticacion.dart';

class repositorioautenticacion implements puertodeautenticacion {
  repositorioautenticacion(this._clienteapi, this._servicioalmacenamiento);

  final clienteapi _clienteapi;
  final seguroalmacenamientoservicio _servicioalmacenamiento;

  @override
  Future<perfilusuarioactual?> obtenerperfilusuarioactual() async {
    final guardado = await _servicioalmacenamiento.obtenerdatosusuario();
    if (guardado == null) return null;
    try {
      final usuario = jsonDecode(guardado);
      if (usuario is! Map<String, dynamic>) return null;
      return perfilusuarioactual(
        nombre: _cadenopcional(usuario['firstName']),
        apellidos: _cadenopcional(usuario['lastName']),
        correo: _cadenopcional(usuario['email']),
        rol: _cadenopcional(usuario['role']),
      );
    } on FormatException {
      return null;
    }
  }

  @override
  Future<void> activarcuentaestudiante({
    required String activationToken,
    required String clavenueva,
  }) async {
    try {
      await _clienteapi.cliente.post(
        '/auth/student/activate',
        data: <String, String>{
          'activationToken': activationToken,
          'newPassword': clavenueva,
        },
      );
    } on DioException catch (error) {
      if (error.response?.statusCode == 400) {
        throw const excepcionautenticacion(
          'El código de activación es inválido o venció.',
        );
      }
      throw const excepcionautenticacion(
        'No se pudo activar la cuenta. Intenta nuevamente.',
      );
    }
  }

  @override
  Future<void> iniciarsesion({
    required String role,
    required String identifier,
    String? secret,
    String? identificadorsecundario,
  }) async {
    try {
      final respuesta = await _clienteapi.cliente.post(
        '/auth/role-login',
        data: <String, String>{
          'role': role,
          'identifier': identifier,
          if (secret != null && secret.isNotEmpty) 'secret': secret,
          if (identificadorsecundario != null &&
              identificadorsecundario.isNotEmpty)
            'secondaryIdentifier': identificadorsecundario,
        },
      );

      final respuestabody = respuesta.data;
      final datos = respuestabody is Map<String, dynamic>
          ? respuestabody['data']
          : null;
      if (datos is! Map<String, dynamic>) {
        throw const excepcionautenticacion(
          'La respuesta de autenticación no es válida.',
        );
      }

      final tokenacceso = datos['accessToken'];
      final tokenrenovacion = datos['refreshToken'];
      if (tokenacceso is! String || tokenrenovacion is! String) {
        throw const excepcionautenticacion(
          'La respuesta de autenticación está incompleta.',
        );
      }

      final generacionsesion = await estadodesionautenticacion.instance
          .reemplazarsesion(
            storage: _servicioalmacenamiento,
            accessToken: tokenacceso,
            tokenrenovacion: tokenrenovacion,
          );
      if (generacionsesion == null) {
        throw const excepcionautenticacion(
          'La sesión fue reemplazada por otro inicio de sesión.',
        );
      }

      final usuario = datos['user'];
      if (usuario is Map<String, dynamic>) {
        final usuariodatossaved = await estadodesionautenticacion.instance
            .guardardatosusuariosivigente(
              storage: _servicioalmacenamiento,
              generation: generacionsesion,
              accessToken: tokenacceso,
              datosusuariojson: jsonEncode(usuario),
            );
        if (!usuariodatossaved) {
          throw const excepcionautenticacion(
            'La sesión fue reemplazada por otro inicio de sesión.',
          );
        }
      }
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        throw const excepcionautenticacion(
          'El usuario o la contraseña son incorrectos.',
        );
      }
      throw const excepcionautenticacion(
        'No se pudo conectar con el servidor. Intenta nuevamente.',
      );
    }
  }

  @override
  Future<void> cerrarsesion() async {
    final logoutgeneracion = estadodesionautenticacion.instance
        .iniciarcierresesion();
    try {
      final tokenrenovacion = await estadodesionautenticacion.instance
          .leertokenrenovacion(_servicioalmacenamiento);
      if (tokenrenovacion != null && tokenrenovacion.isNotEmpty) {
        await _clienteapi.cliente.post(
          '/auth/revoke',
          data: <String, String>{'refreshToken': tokenrenovacion},
        );
      }
    } on DioException {
      // El cierre local debe completarse aunque el servidor no esté disponible.
    } finally {
      await estadodesionautenticacion.instance.limpiaramacenamiento(
        _servicioalmacenamiento,
        generacion: logoutgeneracion,
      );
    }
  }
}

String? _cadenopcional(dynamic valor) => valor is String ? valor : null;
