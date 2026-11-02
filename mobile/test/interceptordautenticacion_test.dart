import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/auth/estadosesionautenticacion.dart';
import 'package:mobile_app/core/network/interceptordautenticacion.dart';
import 'package:mobile_app/core/storage/servicioalmacenamientoseguro.dart';

void main() {
  test('adjunta el token a una solicitud protegida', () async {
    final almacenamiento = _almacenamientomemoria()
      ..tokenacceso = 'access-test';
    final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    String? authorization;
    clientehttp.interceptors.add(
      interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
    );
    clientehttp.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          authorization = options.headers['Authorization']?.toString();
          handler.resolve(
            Response<dynamic>(requestOptions: options, statusCode: 200),
          );
        },
      ),
    );

    await clientehttp.get<void>('/protected');

    expect(authorization, 'Bearer access-test');
  });

  test(
    'renueva el par de tokens y reintenta una solicitud una sola vez',
    () async {
      final almacenamiento = _almacenamientomemoria()
        ..tokenacceso = 'access-expired'
        ..tokenrenovacion = 'refresh-current';
      await estadodesionautenticacion.instance.inicializar(almacenamiento);
      final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      var solicitudcount = 0;
      var renovacioncount = 0;
      String? retryAuthorization;

      clientehttp.interceptors.add(
        interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
      );
      clientehttp.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            solicitudcount++;
            if (solicitudcount == 1) {
              handler.reject(
                DioException(
                  requestOptions: options,
                  type: DioExceptionType.badResponse,
                  response: Response<dynamic>(
                    requestOptions: options,
                    statusCode: 401,
                  ),
                ),
                true,
              );
              return;
            }
            retryAuthorization = options.headers['Authorization']?.toString();
            handler.resolve(
              Response<dynamic>(requestOptions: options, statusCode: 200),
            );
          },
        ),
      );
      renovaciondio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            renovacioncount++;
            expect(options.path, '/auth/refresh');
            expect(options.data, <String, String>{
              'refreshToken': 'refresh-current',
            });
            handler.resolve(
              Response<dynamic>(
                requestOptions: options,
                statusCode: 200,
                data: <String, dynamic>{
                  'data': <String, dynamic>{
                    'accessToken': 'access-new',
                    'refreshToken': 'refresh-new',
                  },
                },
              ),
            );
          },
        ),
      );

      final respuesta = await clientehttp.get<void>('/protected');

      expect(respuesta.statusCode, 200);
      expect(solicitudcount, 2);
      expect(renovacioncount, 1);
      expect(retryAuthorization, 'Bearer access-new');
      expect(almacenamiento.tokenacceso, 'access-new');
      expect(almacenamiento.tokenrenovacion, 'refresh-new');
      expect(almacenamiento.conteolimpieza, 0);
    },
  );

  test('comparte la renovación entre instancias de ApiClient', () async {
    final almacenamiento = _almacenamientomemoria()
      ..tokenacceso = 'access-expired'
      ..tokenrenovacion = 'refresh-current';
    await estadodesionautenticacion.instance.inicializar(almacenamiento);
    final primercliente = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    final segundocliente = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    final renovacioncliente = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    final renovacioniniciada = Completer<void>();
    final liberarrenovacion = Completer<void>();
    var renovacioncount = 0;

    void instalarrespuestaprotegida(Dio cliente) {
      var primersolicitud = true;
      cliente.interceptors.add(
        interceptordautenticacion(almacenamiento, cliente, renovacioncliente),
      );
      cliente.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            if (primersolicitud) {
              primersolicitud = false;
              handler.reject(
                DioException(
                  requestOptions: options,
                  type: DioExceptionType.badResponse,
                  response: Response<dynamic>(
                    requestOptions: options,
                    statusCode: 401,
                  ),
                ),
                true,
              );
              return;
            }
            handler.resolve(
              Response<dynamic>(requestOptions: options, statusCode: 200),
            );
          },
        ),
      );
    }

    instalarrespuestaprotegida(primercliente);
    instalarrespuestaprotegida(segundocliente);
    renovacioncliente.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          renovacioncount++;
          if (!renovacioniniciada.isCompleted) renovacioniniciada.complete();
          await liberarrenovacion.future;
          handler.resolve(
            Response<dynamic>(
              requestOptions: options,
              statusCode: 200,
              data: <String, dynamic>{
                'data': <String, dynamic>{
                  'accessToken': 'access-new',
                  'refreshToken': 'refresh-new',
                },
              },
            ),
          );
        },
      ),
    );

    final requests = [
      primercliente.get<void>('/protected'),
      segundocliente.get<void>('/protected'),
    ];
    await renovacioniniciada.future;
    await Future<void>.delayed(const Duration(milliseconds: 10));
    liberarrenovacion.complete();
    await Future.wait(requests);

    expect(renovacioncount, 1);
    expect(almacenamiento.tokenacceso, 'access-new');
    expect(almacenamiento.tokenrenovacion, 'refresh-new');
    expect(almacenamiento.conteolimpieza, 0);
  });

  test(
    'una respuesta 401 tardía reutiliza el access token ya renovado',
    () async {
      final almacenamiento = _almacenamientodelecturademorada()
        ..tokenacceso = 'access-expired'
        ..tokenrenovacion = 'refresh-current';
      await estadodesionautenticacion.instance.inicializar(almacenamiento);
      almacenamiento.lecturasacceso = 0;
      almacenamiento.lecturasrenovacion = 0;
      almacenamiento.demorarlecturaaccesoquinta = true;

      final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      final renovacioniniciada = Completer<void>();
      final liberarrenovacion = Completer<void>();
      var renovacioncount = 0;
      final attempts = <String, int>{};

      clientehttp.interceptors.add(
        interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
      );
      clientehttp.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            final attempt = (attempts[options.path] ?? 0) + 1;
            attempts[options.path] = attempt;
            if (attempt == 1) {
              handler.reject(
                DioException(
                  requestOptions: options,
                  type: DioExceptionType.badResponse,
                  response: Response<dynamic>(
                    requestOptions: options,
                    statusCode: 401,
                  ),
                ),
                true,
              );
              return;
            }
            handler.resolve(
              Response<dynamic>(requestOptions: options, statusCode: 200),
            );
          },
        ),
      );
      renovaciondio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) async {
            renovacioncount++;
            if (renovacioncount == 1) {
              renovacioniniciada.complete();
              await liberarrenovacion.future;
              handler.resolve(
                Response<dynamic>(
                  requestOptions: options,
                  statusCode: 200,
                  data: <String, dynamic>{
                    'data': <String, dynamic>{
                      'accessToken': 'access-current',
                      'refreshToken': 'refresh-rotated',
                    },
                  },
                ),
              );
              return;
            }
            handler.reject(
              DioException(
                requestOptions: options,
                type: DioExceptionType.badResponse,
                response: Response<dynamic>(
                  requestOptions: options,
                  statusCode: 401,
                ),
              ),
              true,
            );
          },
        ),
      );

      final primersolicitud = clientehttp.get<void>('/first');
      await renovacioniniciada.future;
      final secondsolicitud = clientehttp.get<void>('/second');
      await almacenamiento.lecturaaccesodemoradainiciada.future;

      liberarrenovacion.complete();
      await primersolicitud;
      almacenamiento.liberarlecturademorada.complete();
      await secondsolicitud;

      expect(renovacioncount, 1);
      expect(attempts, {'/first': 2, '/second': 2});
      expect(almacenamiento.tokenacceso, 'access-current');
      expect(almacenamiento.tokenrenovacion, 'refresh-rotated');
      expect(almacenamiento.conteolimpieza, 0);
    },
  );

  test(
    'una renovación anterior no sobrescribe la sesión de una cuenta nueva',
    () async {
      final almacenamiento = _almacenamientomemoria()
        ..tokenacceso = 'access-a-expired'
        ..tokenrenovacion = 'refresh-a';
      final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      final renovacioniniciada = Completer<void>();
      final liberarrenovacion = Completer<void>();
      clientehttp.interceptors.add(
        interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
      );
      clientehttp.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            handler.reject(
              DioException(
                requestOptions: options,
                type: DioExceptionType.badResponse,
                response: Response<dynamic>(
                  requestOptions: options,
                  statusCode: 401,
                ),
              ),
              true,
            );
          },
        ),
      );
      renovaciondio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) async {
            renovacioniniciada.complete();
            await liberarrenovacion.future;
            handler.resolve(
              Response<dynamic>(
                requestOptions: options,
                statusCode: 200,
                data: <String, dynamic>{
                  'data': <String, dynamic>{
                    'accessToken': 'access-a-new',
                    'refreshToken': 'refresh-a-new',
                  },
                },
              ),
            );
          },
        ),
      );

      final solicitud = clientehttp.get<void>('/protected');
      await renovacioniniciada.future;
      final iniciarsesiongeneracion = await estadodesionautenticacion.instance
          .reemplazarsesion(
            storage: almacenamiento,
            accessToken: 'access-b',
            tokenrenovacion: 'refresh-b',
          );
      expect(iniciarsesiongeneracion, isNotNull);
      liberarrenovacion.complete();
      await expectLater(solicitud, throwsA(isA<DioException>()));

      expect(almacenamiento.tokenacceso, 'access-b');
      expect(almacenamiento.tokenrenovacion, 'refresh-b');
      expect(almacenamiento.conteolimpieza, 0);
    },
  );

  test(
    'un 401 sin refresh token borra la sesión antes de propagar el error',
    () async {
      final almacenamiento = _almacenamientomemoria()
        ..tokenacceso = 'access-test';
      await estadodesionautenticacion.instance.inicializar(almacenamiento);
      final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
      clientehttp.interceptors.add(
        interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
      );
      clientehttp.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            handler.reject(
              DioException(
                requestOptions: options,
                type: DioExceptionType.badResponse,
                response: Response<dynamic>(
                  requestOptions: options,
                  statusCode: 401,
                ),
              ),
              true,
            );
          },
        ),
      );

      await expectLater(
        clientehttp.get<void>('/protected'),
        throwsA(isA<DioException>()),
      );

      expect(almacenamiento.conteolimpieza, 1);
      expect(almacenamiento.tokenacceso, isNull);
      expect(estadodesionautenticacion.instance.tienesesion, isFalse);
    },
  );

  test('un 401 de inicio de sesión no renueva ni borra otra sesión', () async {
    final almacenamiento = _almacenamientomemoria()
      ..tokenacceso = 'access-current'
      ..tokenrenovacion = 'refresh-current';
    final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    var renovacioncount = 0;
    clientehttp.interceptors.add(
      interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
    );
    clientehttp.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          handler.reject(
            DioException(
              requestOptions: options,
              type: DioExceptionType.badResponse,
              response: Response<dynamic>(
                requestOptions: options,
                statusCode: 401,
              ),
            ),
            true,
          );
        },
      ),
    );
    renovaciondio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          renovacioncount++;
          handler.next(options);
        },
      ),
    );

    await expectLater(
      clientehttp.post<void>('/auth/role-login'),
      throwsA(isA<DioException>()),
    );

    expect(renovacioncount, 0);
    expect(almacenamiento.conteolimpieza, 0);
    expect(almacenamiento.tokenacceso, 'access-current');
    expect(almacenamiento.tokenrenovacion, 'refresh-current');
  });

  test('un error distinto de 401 conserva la sesión', () async {
    final almacenamiento = _almacenamientomemoria()
      ..tokenacceso = 'access-test';
    final clientehttp = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    final renovaciondio = Dio(BaseOptions(baseUrl: 'https://test.invalid'));
    clientehttp.interceptors.add(
      interceptordautenticacion(almacenamiento, clientehttp, renovaciondio),
    );
    clientehttp.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          handler.reject(
            DioException(
              requestOptions: options,
              type: DioExceptionType.badResponse,
              response: Response<dynamic>(
                requestOptions: options,
                statusCode: 403,
              ),
            ),
            true,
          );
        },
      ),
    );

    await expectLater(
      clientehttp.get<void>('/protected'),
      throwsA(isA<DioException>()),
    );

    expect(almacenamiento.conteolimpieza, 0);
    expect(almacenamiento.tokenacceso, 'access-test');
  });
}

class _almacenamientomemoria extends seguroalmacenamientoservicio {
  String? tokenacceso;
  String? tokenrenovacion;
  int conteolimpieza = 0;

  @override
  Future<String?> obtenertokenacceso() async => tokenacceso;

  @override
  Future<String?> obtenertokenrenovacion() async => tokenrenovacion;

  @override
  Future<void> guardartokens({
    required String accessToken,
    required String tokenrenovacion,
  }) async {
    tokenacceso = accessToken;
    this.tokenrenovacion = tokenrenovacion;
  }

  @override
  Future<void> limpiarcache() async {}

  @override
  Future<void> limpiardatosusuario() async {}

  @override
  Future<void> limpiartodo() async {
    conteolimpieza++;
    tokenacceso = null;
    tokenrenovacion = null;
  }
}

class _almacenamientodelecturademorada extends _almacenamientomemoria {
  final lecturaaccesodemoradainiciada = Completer<void>();
  final liberarlecturademorada = Completer<void>();
  int lecturasacceso = 0;
  int lecturasrenovacion = 0;
  bool demorarlecturaaccesoquinta = false;

  @override
  Future<String?> obtenertokenacceso() async {
    lecturasacceso++;
    final tokenatlecturainicio = tokenacceso;
    if (demorarlecturaaccesoquinta && lecturasacceso == 5) {
      lecturaaccesodemoradainiciada.complete();
      await liberarlecturademorada.future;
    }
    return tokenatlecturainicio;
  }

  @override
  Future<String?> obtenertokenrenovacion() async {
    lecturasrenovacion++;
    if (lecturasrenovacion == 3) return 'refresh-expired';
    return tokenrenovacion;
  }
}
