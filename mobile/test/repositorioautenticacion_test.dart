import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/network/clienteapi.dart';
import 'package:mobile_app/core/storage/servicioalmacenamientoseguro.dart';
import 'package:mobile_app/features/auth/data/repositorioautenticacion.dart';
import 'package:mobile_app/features/auth/domain/excepcionautenticacion.dart';

void main() {
  test('login familiar guarda los tokens y el usuario recibido', () async {
    final almacenamiento = _almacenamientomemoria();
    Map<String, dynamic>? requestBody;
    final cliente = _clienteapiensoporte(
      almacenamiento,
      _dioprueba((options, handler) {
        expect(options.path, '/auth/role-login');
        requestBody = Map<String, dynamic>.from(
          options.data as Map<String, dynamic>,
        );
        handler.resolve(
          Response<dynamic>(
            requestOptions: options,
            statusCode: 200,
            data: <String, dynamic>{
              'data': <String, dynamic>{
                'accessToken': 'access-test',
                'refreshToken': 'refresh-test',
                'user': <String, dynamic>{'id': 'parent-1', 'role': 'PARENT'},
              },
            },
          ),
        );
      }),
    );

    await repositorioautenticacion(cliente, almacenamiento).iniciarsesion(
      role: 'FAMILY',
      identifier: '1234567',
      secret: 'ClaveFamiliarSegura2026',
      identificadorsecundario: '70000000',
    );

    expect(requestBody, <String, String>{
      'role': 'FAMILY',
      'identifier': '1234567',
      'secret': 'ClaveFamiliarSegura2026',
      'secondaryIdentifier': '70000000',
    });
    expect(almacenamiento.tokenacceso, 'access-test');
    expect(almacenamiento.tokenrenovacion, 'refresh-test');
    expect(jsonDecode(almacenamiento.datosusuario!), <String, dynamic>{
      'id': 'parent-1',
      'role': 'PARENT',
    });
  });

  test(
    'login inválido muestra error de credenciales y no guarda sesión',
    () async {
      final almacenamiento = _almacenamientomemoria();
      final cliente = _clienteapiensoporte(
        almacenamiento,
        _dioprueba((options, handler) {
          handler.reject(
            DioException(
              requestOptions: options,
              type: DioExceptionType.badResponse,
              response: Response<dynamic>(
                requestOptions: options,
                statusCode: 401,
              ),
            ),
          );
        }),
      );

      await expectLater(
        repositorioautenticacion(cliente, almacenamiento).iniciarsesion(
          role: 'TEACHER',
          identifier: 'DOC-1',
          secret: 'incorrecta',
        ),
        throwsA(
          isA<excepcionautenticacion>().having(
            (error) => error.mensaje,
            'mensaje',
            'El usuario o la contraseña son incorrectos.',
          ),
        ),
      );
      expect(almacenamiento.tokenacceso, isNull);
      expect(almacenamiento.tokenrenovacion, isNull);
      expect(almacenamiento.datosusuario, isNull);
    },
  );

  test('logout revoca el refresh token y limpia los datos locales', () async {
    final almacenamiento = _almacenamientomemoria()
      ..tokenacceso = 'access-test'
      ..tokenrenovacion = 'refresh-test'
      ..datosusuario = '{"id":"parent-1"}';
    Map<String, dynamic>? requestBody;
    final cliente = _clienteapiensoporte(
      almacenamiento,
      _dioprueba((options, handler) {
        expect(options.path, '/auth/revoke');
        requestBody = Map<String, dynamic>.from(
          options.data as Map<String, dynamic>,
        );
        handler.resolve(
          Response<dynamic>(requestOptions: options, statusCode: 204),
        );
      }),
    );

    await repositorioautenticacion(cliente, almacenamiento).cerrarsesion();

    expect(requestBody, <String, String>{'refreshToken': 'refresh-test'});
    expect(almacenamiento.conteolimpieza, 1);
    expect(almacenamiento.tokenacceso, isNull);
    expect(almacenamiento.tokenrenovacion, isNull);
    expect(almacenamiento.datosusuario, isNull);
  });

  test('logout limpia la sesión aunque falle la revocación remota', () async {
    final almacenamiento = _almacenamientomemoria()
      ..tokenacceso = 'access-test'
      ..tokenrenovacion = 'refresh-test'
      ..datosusuario = '{"id":"parent-1"}';
    final cliente = _clienteapiensoporte(
      almacenamiento,
      _dioprueba((options, handler) {
        handler.reject(
          DioException(
            requestOptions: options,
            type: DioExceptionType.connectionError,
          ),
        );
      }),
    );

    await repositorioautenticacion(cliente, almacenamiento).cerrarsesion();

    expect(almacenamiento.conteolimpieza, 1);
    expect(almacenamiento.tokenacceso, isNull);
    expect(almacenamiento.tokenrenovacion, isNull);
    expect(almacenamiento.datosusuario, isNull);
  });
}

Dio _dioprueba(
  void Function(RequestOptions, RequestInterceptorHandler) responder,
) {
  final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
  clientehttp.interceptors.add(InterceptorsWrapper(onRequest: responder));
  return clientehttp;
}

class _clienteapiensoporte extends clienteapi {
  _clienteapiensoporte(super.storage, this._clienteapi);

  final Dio _clienteapi;

  @override
  Dio get cliente => _clienteapi;
}

class _almacenamientomemoria extends seguroalmacenamientoservicio {
  String? tokenacceso;
  String? tokenrenovacion;
  String? datosusuario;
  int conteolimpieza = 0;

  @override
  Future<void> guardartokens({
    required String accessToken,
    required String tokenrenovacion,
  }) async {
    tokenacceso = accessToken;
    this.tokenrenovacion = tokenrenovacion;
  }

  @override
  Future<String?> obtenertokenacceso() async => tokenacceso;

  @override
  Future<String?> obtenertokenrenovacion() async => tokenrenovacion;

  @override
  Future<void> guardardatosusuario(String datosusuariojson) async {
    datosusuario = datosusuariojson;
  }

  @override
  Future<void> limpiardatosusuario() async {
    datosusuario = null;
  }

  @override
  Future<void> limpiarcache() async {}

  @override
  Future<void> limpiartodo() async {
    conteolimpieza++;
    tokenacceso = null;
    tokenrenovacion = null;
    datosusuario = null;
  }
}
