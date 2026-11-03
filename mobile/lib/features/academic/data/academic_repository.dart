import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';

import '../../../core/auth/estadosesionautenticacion.dart';
import '../../../core/network/clienteapi.dart';
import '../../../core/storage/servicioalmacenamientoseguro.dart';
import '../domain/entities/registrosacademicos.dart';
import '../domain/exceptions/excepcionacademica.dart';
import '../domain/repositories/repositorioacademico.dart';
import './mappers/mapeadorregistrosacademicos.dart';

class AcademicRepository implements puertorepositorioacademico {
  AcademicRepository(
    this._clienteapi, [
    seguroalmacenamientoservicio? almacenamiento,
  ]) : _almacenamiento = almacenamiento ?? seguroalmacenamientoservicio();

  final clienteapi _clienteapi;
  final seguroalmacenamientoservicio _almacenamiento;

  @override
  Future<resultadoencache<List<periodoacademico>>> obtenerperiodosencache() async {
    try {
      return await _obtenerlistaencache(
        cacheKey: 'periods',
        path: '/periods',
        queryParameters: {},
        pageSize: 100,
        paginated: false,
        parse: (items) =>
            items.map(mapeadorregistrosacademicos.periodo).toList(),
      );
    } on DioException catch (error) {
      if (!_esfallodeconexion(error)) rethrow;
      return const resultadoencache(datos: [], estaoffline: true);
    }
  }

  @override
  Future<resultadoencache<List<resumendeestudiante>>>
  obtenerestudiantesencache() => _obtenerlistaencache(
    cacheKey: 'students',
    path: '/students',
    queryParameters: {'limit': 100},
    pageSize: 100,
    parse: (items) =>
        items.map(mapeadorregistrosacademicos.estudiante).toList(),
  );

  @override
  Future<List<resumendeestudiante>> obtenerestudiantes() async {
    return (await obtenerestudiantesencache()).datos;
  }

  @override
  Future<resultadoencache<List<resumendecalificacion>>> getGradesWithCache({
    String? identificadorestudiante,
  }) async {
    final cachekey = 'grades_${identificadorestudiante ?? 'all'}';
    return _obtenerlistaencache(
      cacheKey: cachekey,
      path: '/grades',
      queryParameters: {'studentId': identificadorestudiante, 'limit': 200},
      pageSize: 200,
      parse: (items) =>
          items.map(mapeadorregistrosacademicos.calificacion).toList(),
    );
  }

  @override
  Future<List<resumendecalificacion>> obtenercalificaciones({
    String? identificadorestudiante,
  }) async {
    final resultado = await getGradesWithCache(
      identificadorestudiante: identificadorestudiante,
    );
    return resultado.datos;
  }

  @override
  Future<resultadoencache<List<resumendeasistencia>>> obtenerasistenciaencache({
    String? identificadorestudiante,
  }) {
    return _obtenerlistaencache(
      cacheKey: 'attendance_${identificadorestudiante ?? 'all'}',
      path: '/attendance',
      queryParameters: {'studentId': identificadorestudiante, 'limit': 200},
      pageSize: 200,
      parse: (items) =>
          items.map(mapeadorregistrosacademicos.asistencia).toList(),
    );
  }

  @override
  Future<List<resumendeasistencia>> obtenerasistencia({
    String? identificadorestudiante,
  }) async {
    return (await obtenerasistenciaencache(
      identificadorestudiante: identificadorestudiante,
    )).datos;
  }

  @override
  Future<resultadoencache<List<resumendealerta>>> obteneralertasencache() {
    return _obtenerlistaencache(
      cacheKey: 'alerts',
      path: '/alerts',
      queryParameters: {'limit': 100},
      pageSize: 100,
      parse: (items) => items.map(mapeadorregistrosacademicos.alerta).toList(),
    );
  }

  @override
  Future<List<resumendealerta>> obteneralertas() async {
    return (await obteneralertasencache()).datos;
  }

  @override
  Future<resultadoencache<List<resumendeasignacion>>> obtenerasignacionesencache({
    String? idcurso,
    String? idmateria,
  }) {
    final query = <String, dynamic>{'limit': 100};
    if (idcurso != null && idcurso.isNotEmpty) query['courseId'] = idcurso;
    if (idmateria != null && idmateria.isNotEmpty) query['subjectId'] = idmateria;
    return _obtenerlistaencache(
      cacheKey: 'assignments_${idcurso ?? 'all'}_${idmateria ?? 'all'}',
      path: '/assignments',
      queryParameters: query,
      pageSize: 100,
      paginated: false,
      parse: (items) =>
          items.map(mapeadorregistrosacademicos.asignacion).toList(),
    );
  }

  @override
  Future<List<resumendeasignacion>> obtenerasignaciones({
    String? idcurso,
    String? idmateria,
  }) async {
    return (await obtenerasignacionesencache(
      idcurso: idcurso,
      idmateria: idmateria,
    )).datos;
  }

  @override
  Future<resultadoencache<List<resumendecomunicado>>> obtenercomunicadosencache() {
    return _obtenerlistaencache(
      cacheKey: 'announcements',
      path: '/announcements',
      queryParameters: {},
      pageSize: 100,
      paginated: false,
      parse: (items) =>
          items.map(mapeadorregistrosacademicos.comunicado).toList(),
    );
  }

  @override
  Future<List<resumendecomunicado>> obtenercomunicados() async {
    return (await obtenercomunicadosencache()).datos;
  }

  @override
  Future<resultadoencache<horariomi>> obtenermihorarioencache() async {
    final sessionestado = estadodesionautenticacion.instance;
    final generacionsesion = sessionestado.generacion;
    _verificarsesionvigente(sessionestado, generacionsesion);

    try {
      final respuesta = await _clienteapi.cliente.get('/schedules/my-schedule');
      final cuerpo = respuesta.data;
      final datos = cuerpo is Map<String, dynamic>
          ? (cuerpo['data'] as Map<String, dynamic>?) ?? {}
          : <String, dynamic>{};
      final parsed = mapeadorregistrosacademicos.parsearhorariomi(datos);
      await sessionestado.guardarcachesivigente(
        storage: _almacenamiento,
        generation: generacionsesion,
        cacheKey: 'my_schedule',
        cadenajson: jsonEncode(datos),
      );
      return resultadoencache(
        datos: parsed,
        estaoffline: false,
        fechaencache: DateTime.now(),
      );
    } on DioException catch (error) {
      if (!_esfallodeconexion(error)) rethrow;
      final cachedJson = await sessionestado.leercachesivigente(
        storage: _almacenamiento,
        generation: generacionsesion,
        cachekey: 'my_schedule',
      );
      if (cachedJson != null) {
        final decoded = jsonDecode(cachedJson) as Map<String, dynamic>;
        return resultadoencache(
          datos: mapeadorregistrosacademicos.parsearhorariomi(decoded),
          estaoffline: true,
          fechaencache: await sessionestado.leerfechacachesivigente(
            storage: _almacenamiento,
            generation: generacionsesion,
            cachekey: 'my_schedule',
          ),
        );
      }
      rethrow;
    }
  }

  @override
  Future<horariomi> obtenermihorario() async {
    return (await obtenermihorarioencache()).datos;
  }

  @override
  Future<void> solicitarentrevista({
    required String idestudiante,
    required String nombreestudiante,
    required String docenteomateria,
    required String fecha,
    required String motivo,
  }) async {
    const clave = 'meeting_requests';
    final existing = await _almacenamiento.obtenercache(clave);
    final List<dynamic> lista = existing != null ? jsonDecode(existing) : [];
    lista.add({
      'studentId': idestudiante,
      'studentName': nombreestudiante,
      'teacherOrSubject': docenteomateria,
      'requestedDate': fecha,
      'reason': motivo,
      'createdAt': DateTime.now().toIso8601String(),
      'status': 'SOLICITADA',
    });
    await _almacenamiento.guardarcache(clave, jsonEncode(lista));
  }

  Future<resultadoencache<List<T>>> _obtenerlistaencache<T>({
    required String cacheKey,
    required String path,
    required Map<String, dynamic> queryParameters,
    required int pageSize,
    bool paginated = true,
    required List<T> Function(List<Map<String, dynamic>>) parse,
  }) async {
    final sessionestado = estadodesionautenticacion.instance;
    final generacionsesion = sessionestado.generacion;
    _verificarsesionvigente(sessionestado, generacionsesion);

    late final List<Map<String, dynamic>> rows;
    try {
      rows = await _obtenertodaslaspaginas(
        sessionState: sessionestado,
        sessionGeneration: generacionsesion,
        path: path,
        queryParameters: queryParameters,
        pagesize: pageSize,
        paginated: paginated,
      );
    } on DioException catch (error) {
      if (!_esfallodeconexion(error)) rethrow;
      _verificarsesionvigente(sessionestado, generacionsesion);
      final cachejson = await sessionestado.leercachesivigente(
        storage: _almacenamiento,
        generation: generacionsesion,
        cachekey: cacheKey,
      );
      _verificarsesionvigente(sessionestado, generacionsesion);
      if (cachejson == null) rethrow;
      try {
        final cacheat = await sessionestado.leerfechacachesivigente(
          storage: _almacenamiento,
          generation: generacionsesion,
          cachekey: cacheKey,
        );
        _verificarsesionvigente(sessionestado, generacionsesion);
        final cache = resultadoencache(
          datos: parse(_lista(jsonDecode(cachejson))),
          estaoffline: true,
          fechaencache: cacheat,
        );
        _verificarsesionvigente(sessionestado, generacionsesion);
        return cache;
      } on FormatException {
        throw const excepcionacademica(
          'Los registros guardados no son válidos.',
        );
      } on excepcionacademica {
        throw const excepcionacademica(
          'Los registros guardados no son válidos.',
        );
      }
    }

    _verificarsesionvigente(sessionestado, generacionsesion);
    final parsed = parse(rows);
    final guardado = await sessionestado.guardarcachesivigente(
      storage: _almacenamiento,
      generation: generacionsesion,
      cacheKey: cacheKey,
      cadenajson: jsonEncode({'data': rows, 'total': rows.length}),
    );
    if (!guardado) _lanzarsesioncambiada();
    _verificarsesionvigente(sessionestado, generacionsesion);
    return resultadoencache(
      datos: parsed,
      estaoffline: false,
      fechaencache: DateTime.now(),
    );
  }

  Future<List<Map<String, dynamic>>> _obtenertodaslaspaginas({
    required estadodesionautenticacion sessionState,
    required int sessionGeneration,
    required String path,
    required Map<String, dynamic> queryParameters,
    required int pagesize,
    required bool paginated,
  }) async {
    final rows = <Map<String, dynamic>>[];
    int? expectedTotal;
    var offset = 0;

    while (true) {
      _verificarsesionvigente(sessionState, sessionGeneration);
      final respuesta = await _clienteapi.cliente.get(
        path,
        queryParameters: {
          ...queryParameters,
          'limit': pagesize,
          'offset': offset,
        },
      );
      _verificarsesionvigente(sessionState, sessionGeneration);
      final cuerpo = respuesta.data;
      if (cuerpo is! Map<String, dynamic> || cuerpo['data'] is! List<dynamic>) {
        throw const excepcionacademica(
          'La respuesta del servidor no es válida.',
        );
      }

      final page = _lista(cuerpo);
      if (!paginated) {
        rows.addAll(page);
        break;
      }
      final totalvalor = cuerpo['total'];
      if (totalvalor == null) {
        if (page.length >= pagesize) {
          throw const excepcionacademica(
            'El servidor no informó el total; no se puede confirmar que el historial esté completo.',
          );
        }
        rows.addAll(page);
        break;
      }
      if (totalvalor is! int || totalvalor < 0) {
        throw const excepcionacademica(
          'El total de registros del servidor no es válido.',
        );
      }
      if (expectedTotal != null && totalvalor != expectedTotal) {
        throw const excepcionacademica(
          'Los registros cambiaron durante la consulta. Actualiza la pantalla para volver a cargarlos.',
        );
      }
      expectedTotal = totalvalor;

      final remaining = expectedTotal - rows.length;
      if (page.length > remaining) {
        throw const excepcionacademica(
          'El servidor devolvió más registros de los esperados.',
        );
      }
      rows.addAll(page);
      if (rows.length == expectedTotal) break;
      if (page.isEmpty || page.length < pagesize) {
        throw const excepcionacademica(
          'El servidor devolvió un historial parcial. La caché anterior se conservó.',
        );
      }
      offset += page.length;
    }

    return rows;
  }

  void _verificarsesionvigente(
    estadodesionautenticacion sessionestado,
    int generacion,
  ) {
    if (!sessionestado.essesionvigente(generacion)) _lanzarsesioncambiada();
  }

  Never _lanzarsesioncambiada() {
    throw DioException(
      requestOptions: RequestOptions(path: ''),
      type: DioExceptionType.cancel,
      message: 'La sesión cambió durante la solicitud.',
    );
  }

  List<Map<String, dynamic>> _lista(dynamic cuerpo) {
    if (cuerpo is! Map<String, dynamic> || cuerpo['data'] is! List<dynamic>) {
      throw const excepcionacademica('La respuesta del servidor no es válida.');
    }
    final rows = cuerpo['data'] as List<dynamic>;
    return [
      for (var indice = 0; indice < rows.length; indice++)
        if (rows[indice] is Map<String, dynamic>)
          rows[indice] as Map<String, dynamic>
        else
          throw excepcionacademica(
            'El registro ${indice + 1} de la respuesta no es válido.',
          ),
    ];
  }
}

bool _esfallodeconexion(DioException error) {
  switch (error.type) {
    case DioExceptionType.connectionTimeout:
    case DioExceptionType.sendTimeout:
    case DioExceptionType.receiveTimeout:
    case DioExceptionType.connectionError:
      return true;
    case DioExceptionType.unknown:
      return error.error is SocketException;
    default:
      return false;
  }
}
