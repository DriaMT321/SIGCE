import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/auth/estadosesionautenticacion.dart';
import 'package:mobile_app/core/network/clienteapi.dart';
import 'package:mobile_app/core/storage/servicioalmacenamientoseguro.dart';
import 'package:mobile_app/features/academic/data/academic_repository.dart';
import 'package:mobile_app/features/academic/domain/exceptions/excepcionacademica.dart';

void main() {
  late almacenamientomemoria almacenamiento;
  late servidorprueba servidor;
  late AcademicRepository repositorio;

  setUp(() async {
    almacenamiento = almacenamientomemoria();
    servidor = servidorprueba();
    repositorio = AcademicRepository(
      clienteapisimulacion(servidor.clientehttp, almacenamiento),
      almacenamiento,
    );
    await estadodesionautenticacion.instance.inicializar(almacenamiento);
  });

  test(
    'guarda el catálogo completo de períodos y lo recupera sin conexión',
    () async {
      servidor.responder('/periods', {
        'data': List.generate(
          101,
          (i) => {
            'id': 'period-$i',
            'name': 'Período $i',
            'academicYearId': 'year-$i',
            'startDate': '2026-01-01T00:00:00.000Z',
            'endDate': '2026-04-30T00:00:00.000Z',
            'academicYear': {'year': 2026, 'isActive': i == 0},
          },
        ),
      });
      final original = await repositorio.obtenerperiodosencache();
      expect(original.datos, hasLength(101));
      expect(original.datos.first.gestion, 2026);
      expect(original.datos.first.contiene(DateTime.utc(2026, 4, 30)), isTrue);
      expect(original.datos.first.contiene(DateTime.utc(2026, 5, 1)), isFalse);
      servidor.sinconexion = true;
      final guardado = await repositorio.obtenerperiodosencache();
      expect(guardado.estaoffline, isTrue);
      expect(guardado.datos, hasLength(101));
    },
  );

  test(
    'lee estudiantes y distingue una matrícula activa de uno sin matrícula',
    () async {
      servidor.responder('/students', {
        'data': [
          _estudiante('student-1', 'RUDE-1', curso: 'Tercero A'),
          _estudiante('student-2', 'RUDE-2'),
        ],
      });

      final estudiantes = await repositorio.obtenerestudiantes();

      expect(
        estudiantes.map((estudiante) => estudiante.identificador).toList(),
        ['student-1', 'student-2'],
      );
      expect(estudiantes.first.nombre, 'Ana Pérez');
      expect(estudiantes.first.rude, 'RUDE-1');
      expect(estudiantes.first.nombrecurso, 'Tercero A');
      expect(estudiantes.last.nombrecurso, 'Sin matrícula');
      expect(servidor.solicitudes.single.path, '/students');
      expect(servidor.solicitudes.single.queryParameters['limit'], 100);
    },
  );

  test('rechaza una fila mal formada en vez de ocultarla', () async {
    servidor.responder('/students', {
      'data': [_estudiante('student-1', 'RUDE-1'), 'fila inválida'],
    });

    await expectLater(
      repositorio.obtenerestudiantes(),
      throwsA(
        isA<excepcionacademica>().having(
          (error) => error.mensaje,
          'message',
          contains('registro 2'),
        ),
      ),
    );
  });

  test(
    'lee notas reales incluido el cero y guarda la respuesta por estudiante',
    () async {
      servidor.responder('/grades', {
        'data': [_calificacion(0, 'Ana', 'Pérez')],
      });

      final resultado = await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-1',
      );

      expect(resultado.estaoffline, isFalse);
      expect(resultado.datos.single.valor, 0);
      expect(resultado.datos.single.materia, 'Matemática');
      expect(resultado.datos.single.periodo, 'Primer trimestre');
      expect(resultado.datos.single.nombreestudiante, 'Ana Pérez');
      expect(almacenamiento.guardado.keys, contains('grades_student-1'));
      expect(
        servidor.solicitudes.single.queryParameters['studentId'],
        'student-1',
      );
      expect(servidor.solicitudes.single.queryParameters['limit'], 200);
    },
  );

  test(
    'carga todas las páginas antes de guardar el historial completo',
    () async {
      final calificaciones = List.generate(
        202,
        (indice) => _calificacion(indice, 'Ana', 'Pérez'),
      );
      servidor.responder('/grades', (RequestOptions opciones) {
        final offset = opciones.queryParameters['offset'] as int;
        return {
          'data': calificaciones.skip(offset).take(200).toList(),
          'total': calificaciones.length,
        };
      });

      final resultado = await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-1',
      );

      expect(resultado.datos, hasLength(202));
      expect(
        servidor.solicitudes.map(
          (solicitud) => solicitud.queryParameters['offset'],
        ),
        [0, 200],
      );
      expect(
        servidor.solicitudes.every(
          (solicitud) => solicitud.queryParameters['studentId'] == 'student-1',
        ),
        isTrue,
      );
      expect(
        almacenamiento.guardado['grades_student-1'],
        contains('"total":202'),
      );
    },
  );

  test('no sustituye la caché cuando una página llega incompleta', () async {
    servidor.responder('/grades', {
      'data': [_calificacion(85, 'Ana', 'Pérez')],
      'total': 1,
    });
    await repositorio.getGradesWithCache(identificadorestudiante: 'student-1');
    final cacheanterior = almacenamiento.guardado['grades_student-1'];

    final calificaciones = List.generate(
      200,
      (indice) => _calificacion(indice, 'Ana', 'Pérez'),
    );
    servidor.responder('/grades', (RequestOptions opciones) {
      final offset = opciones.queryParameters['offset'] as int;
      return {
        'data': offset == 0 ? calificaciones : <Map<String, dynamic>>[],
        'total': 201,
      };
    });

    await expectLater(
      repositorio.getGradesWithCache(identificadorestudiante: 'student-1'),
      throwsA(isA<excepcionacademica>()),
    );
    expect(almacenamiento.guardado['grades_student-1'], cacheanterior);
  });

  test(
    'no sustituye una nota ausente con cero ni con una copia anterior',
    () async {
      servidor.responder('/grades', {
        'data': [_calificacion(85, 'Ana', 'Pérez')],
      });
      await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-1',
      );
      final cacheanterior = almacenamiento.guardado['grades_student-1'];

      final calificacionmalformada = _calificacion(85, 'Ana', 'Pérez')
        ..remove('value');
      servidor.responder('/grades', {
        'data': [calificacionmalformada],
      });

      await expectLater(
        repositorio.getGradesWithCache(identificadorestudiante: 'student-1'),
        throwsA(isA<excepcionacademica>()),
      );
      expect(almacenamiento.guardado['grades_student-1'], cacheanterior);
    },
  );

  test(
    'muestra solo el caché del estudiante consultado al perder la conexión',
    () async {
      servidor.responder('/grades', {
        'data': [_calificacion(85, 'Ana', 'Pérez')],
      });
      await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-1',
      );
      servidor.responder('/grades', {
        'data': [_calificacion(72, 'Luis', 'Rojas')],
      });
      await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-2',
      );
      servidor.sinconexion = true;

      final primero = await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-1',
      );
      final segundo = await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-2',
      );

      expect(primero.estaoffline, isTrue);
      expect(primero.datos.single.valor, 85);
      expect(primero.datos.single.nombreestudiante, 'Ana Pérez');
      expect(segundo.estaoffline, isTrue);
      expect(segundo.datos.single.valor, 72);
      expect(segundo.datos.single.nombreestudiante, 'Luis Rojas');
      expect(primero.fechaencache, almacenamiento.marcatiempo);
      await expectLater(
        repositorio.getGradesWithCache(identificadorestudiante: 'student-3'),
        throwsA(isA<DioException>()),
      );
    },
  );

  test(
    'mantiene estudiantes, asistencia y alertas disponibles sin conexión',
    () async {
      servidor.responder('/students', {
        'data': [_estudiante('student-1', 'RUDE-1', curso: 'Tercero A')],
      });
      servidor.responder('/attendance', {
        'data': [
          {
            'date': '2026-10-15T08:00:00.000Z',
            'status': 'PRESENT',
            'student': {'firstName': 'Ana', 'lastName': 'Pérez'},
          },
        ],
      });
      servidor.responder('/alerts', {
        'data': [
          {
            'title': 'Seguimiento',
            'message': 'Revisar asistencia',
            'severity': 'WARNING',
            'createdAt': '2026-10-15T08:00:00.000Z',
            'isRead': false,
          },
        ],
      });

      await repositorio.obtenerestudiantesencache();
      await repositorio.obtenerasistenciaencache(
        identificadorestudiante: 'student-1',
      );
      await repositorio.obteneralertasencache();
      servidor.sinconexion = true;

      final estudiantes = await repositorio.obtenerestudiantesencache();
      final asistencia = await repositorio.obtenerasistenciaencache(
        identificadorestudiante: 'student-1',
      );
      final alertas = await repositorio.obteneralertasencache();

      expect(estudiantes.estaoffline, isTrue);
      expect(estudiantes.datos.single.rude, 'RUDE-1');
      expect(asistencia.estaoffline, isTrue);
      expect(asistencia.datos.single.estado, 'PRESENT');
      expect(alertas.estaoffline, isTrue);
      expect(alertas.datos.single.titulo, 'Seguimiento');
    },
  );

  test(
    'no entrega datos guardados cuando el servidor rechaza el acceso',
    () async {
      servidor.responder('/grades', {
        'data': [_calificacion(85, 'Ana', 'Pérez')],
      });
      await repositorio.getGradesWithCache(
        identificadorestudiante: 'student-1',
      );
      servidor.codigorespuesta = 403;

      await expectLater(
        repositorio.getGradesWithCache(identificadorestudiante: 'student-1'),
        throwsA(
          isA<DioException>().having(
            (error) => error.response?.statusCode,
            'statusCode',
            403,
          ),
        ),
      );
    },
  );

  test('una respuesta de una sesión anterior no repuebla la caché', () async {
    almacenamiento.guardado['students'] = '{"data":[]}';
    servidor.responder('/students', {
      'data': [_estudiante('student-a', 'RUDE-A')],
    });
    servidor.esperarrespuestas();

    final solicitudanterior = repositorio.obtenerestudiantesencache();
    await servidor.solicitudiniciada.future;
    final nuevogeneracion = await estadodesionautenticacion.instance
        .reemplazarsesion(
          storage: almacenamiento,
          accessToken: 'access-account-b',
          tokenrenovacion: 'refresh-account-b',
        );
    expect(nuevogeneracion, isNotNull);
    expect(almacenamiento.guardado, isEmpty);

    servidor.liberarrespuesta.complete();
    await expectLater(
      solicitudanterior,
      throwsA(
        isA<DioException>().having(
          (error) => error.type,
          'type',
          DioExceptionType.cancel,
        ),
      ),
    );

    servidor.sinconexion = true;
    await expectLater(
      repositorio.obtenerestudiantesencache(),
      throwsA(
        isA<DioException>().having(
          (error) => error.type,
          'type',
          DioExceptionType.connectionError,
        ),
      ),
    );
    expect(almacenamiento.guardado, isEmpty);
  });

  test('rechaza un caché corrupto con un error visible', () async {
    almacenamiento.guardado['grades_student-1'] = '{';
    servidor.sinconexion = true;

    await expectLater(
      repositorio.getGradesWithCache(identificadorestudiante: 'student-1'),
      throwsA(
        isA<excepcionacademica>().having(
          (error) => error.mensaje,
          'message',
          contains('registros guardados'),
        ),
      ),
    );
  });

  test('lee asistencia con fecha, estado, alumno y justificación', () async {
    servidor.responder('/attendance', {
      'data': [
        {
          'date': '2026-10-15T08:00:00.000Z',
          'status': 'JUSTIFIED',
          'student': {'firstName': 'Ana', 'lastName': 'Pérez'},
          'justification': 'Consulta médica',
        },
      ],
    });

    final asistencia = await repositorio.obtenerasistencia(
      identificadorestudiante: 'student-1',
    );

    expect(asistencia.single.fecha.toUtc(), DateTime.utc(2026, 10, 15, 8));
    expect(asistencia.single.estado, 'JUSTIFIED');
    expect(asistencia.single.nombreestudiante, 'Ana Pérez');
    expect(asistencia.single.justificacion, 'Consulta médica');
    expect(
      servidor.solicitudes.single.queryParameters['studentId'],
      'student-1',
    );
  });

  test(
    'rechaza una fecha inválida en asistencia sin inventar la fecha actual',
    () async {
      servidor.responder('/attendance', {
        'data': [
          {
            'date': 'fecha inválida',
            'status': 'ABSENT',
            'student': {'firstName': 'Ana', 'lastName': 'Pérez'},
          },
        ],
      });

      await expectLater(
        repositorio.obtenerasistencia(identificadorestudiante: 'student-1'),
        throwsA(isA<excepcionacademica>()),
      );
    },
  );

  test(
    'rechaza fecha inválida en alertas sin inventar una alerta reciente',
    () async {
      servidor.responder('/alerts', {
        'data': [
          {
            'title': 'Aviso',
            'message': 'Reunión',
            'severity': 'INFO',
            'createdAt': 'fecha inválida',
            'isRead': false,
          },
        ],
      });

      await expectLater(
        repositorio.obteneralertas(),
        throwsA(isA<excepcionacademica>()),
      );
    },
  );
}

Map<String, dynamic> _estudiante(
  String identificador,
  String rude, {
  String? curso,
}) => {
  'id': identificador,
  'firstName': 'Ana',
  'lastName': 'Pérez',
  'rude': rude,
  'enrollments': curso == null
      ? <dynamic>[]
      : [
          {
            'course': {'name': curso},
          },
        ],
};

Map<String, dynamic> _calificacion(
  num valor,
  String nombre,
  String apellidos,
) => {
  'value': valor,
  'subject': {'name': 'Matemática'},
  'period': {'name': 'Primer trimestre'},
  'student': {'firstName': nombre, 'lastName': apellidos},
};

class almacenamientomemoria extends seguroalmacenamientoservicio {
  final guardado = <String, String>{};
  final marcatiempo = DateTime.utc(2026, 10, 15, 12);
  String? tokenacceso = 'access-account-a';
  String? tokenrenovacion = 'refresh-account-a';

  @override
  Future<String?> obtenertokenacceso() async => tokenacceso;

  @override
  Future<void> guardartokens({
    required String accessToken,
    required String tokenrenovacion,
  }) async {
    tokenacceso = accessToken;
    this.tokenrenovacion = tokenrenovacion;
  }

  @override
  Future<void> guardardatosusuario(String datosusuariojson) async {}

  @override
  Future<void> limpiardatosusuario() async {}

  @override
  Future<void> limpiarcache() async => guardado.clear();

  @override
  Future<void> limpiartodo() async {
    guardado.clear();
    tokenacceso = null;
    tokenrenovacion = null;
  }

  @override
  Future<void> guardarcache(String key, String cadenajson) async {
    guardado[key] = cadenajson;
  }

  @override
  Future<String?> obtenercache(String key) async => guardado[key];

  @override
  Future<DateTime?> obtenerfechacache(String key) async =>
      guardado.containsKey(key) ? marcatiempo : null;
}

class clienteapisimulacion extends clienteapi {
  clienteapisimulacion(
    this.dioprueba,
    seguroalmacenamientoservicio almacenamiento,
  ) : super(almacenamiento);

  final Dio dioprueba;

  @override
  Dio get cliente => dioprueba;
}

class servidorprueba {
  servidorprueba() {
    clientehttp.interceptors.add(
      InterceptorsWrapper(
        onRequest: (opciones, manejador) async {
          solicitudes.add(opciones);
          if (esperar) {
            esperar = false;
            solicitudiniciada.complete();
            await liberarrespuesta.future;
          }
          if (sinconexion) {
            manejador.reject(
              DioException(
                requestOptions: opciones,
                type: DioExceptionType.connectionError,
              ),
            );
            return;
          }
          if (codigorespuesta != 200) {
            manejador.reject(
              DioException(
                requestOptions: opciones,
                type: DioExceptionType.badResponse,
                response: Response(
                  requestOptions: opciones,
                  statusCode: codigorespuesta,
                ),
              ),
            );
            return;
          }
          final respuestaconfigurada = respuestas[opciones.path];
          final datosrespuesta = respuestaconfigurada is Function
              ? respuestaconfigurada(opciones)
              : respuestaconfigurada;
          manejador.resolve(
            Response(
              requestOptions: opciones,
              statusCode: 200,
              data: datosrespuesta,
            ),
          );
        },
      ),
    );
  }

  final Dio clientehttp = Dio();
  final solicitudes = <RequestOptions>[];
  final respuestas = <String, dynamic>{};
  final solicitudiniciada = Completer<void>();
  final liberarrespuesta = Completer<void>();
  bool esperar = false;
  bool sinconexion = false;
  int codigorespuesta = 200;

  void responder(String ruta, dynamic cuerpo) => respuestas[ruta] = cuerpo;

  void esperarrespuestas() => esperar = true;
}
