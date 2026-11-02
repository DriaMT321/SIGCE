import 'package:dio/dio.dart';

import '../auth/estadosesionautenticacion.dart';
import '../storage/servicioalmacenamientoseguro.dart';

class interceptordautenticacion extends Interceptor {
  interceptordautenticacion(
    this._servicioalmacenamiento,
    this._clienteapi,
    this._clienterenovacion,
  );

  static const clavereintentoautenticacion = 'sigceAuthRetry';
  static const clavegeneracionsesion = 'sigceSessionGeneration';
  static final Map<int, Future<String?>> renovacionesencurso = {};

  final seguroalmacenamientoservicio _servicioalmacenamiento;
  final Dio _clienteapi;
  final Dio _clienterenovacion;
  final estadodesionautenticacion _estadosesion =
      estadodesionautenticacion.instance;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final retrying = options.extra[clavereintentoautenticacion] == true;
    if (retrying) {
      final solicitudgeneracion = options.extra[clavegeneracionsesion];
      if (solicitudgeneracion is int &&
          solicitudgeneracion != _estadosesion.generacion) {
        handler.reject(
          DioException(
            requestOptions: options,
            type: DioExceptionType.cancel,
            error: const _sesioncambiadaduranterenovacion(),
          ),
        );
        return;
      }
    } else {
      options.extra[clavegeneracionsesion] = _estadosesion.generacion;
    }
    final token = await _servicioalmacenamiento.obtenertokenacceso();
    final solicitudgeneracion = options.extra[clavegeneracionsesion];
    if (solicitudgeneracion is int &&
        solicitudgeneracion != _estadosesion.generacion) {
      handler.reject(
        DioException(
          requestOptions: options,
          type: DioExceptionType.cancel,
          error: const _sesioncambiadaduranterenovacion(),
        ),
      );
      return;
    }
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode != 401) {
      handler.next(err);
      return;
    }

    final solicitud = err.requestOptions;
    if (_essolicitudautenticacion(solicitud.path)) {
      handler.next(err);
      return;
    }

    final solicitudgeneracion = solicitud.extra[clavegeneracionsesion] is int
        ? solicitud.extra[clavegeneracionsesion] as int
        : _estadosesion.generacion;
    if (solicitudgeneracion != _estadosesion.generacion) {
      handler.next(err);
      return;
    }

    if (solicitud.extra[clavereintentoautenticacion] == true) {
      await _limpiarsesion(solicitudgeneracion);
      handler.next(err);
      return;
    }

    final tokenaccesoactual = await _servicioalmacenamiento
        .obtenertokenacceso();
    final solicitudaccesotoken = _solicitartokenacceso(solicitud);
    if (tokenaccesoactual != null &&
        tokenaccesoactual.isNotEmpty &&
        solicitudaccesotoken != null &&
        tokenaccesoactual != solicitudaccesotoken) {
      await _reintentarsitokenvigente(
        solicitud,
        err,
        solicitudgeneracion,
        handler,
      );
      return;
    }

    try {
      final tokenacceso = await _renovartokenacceso(
        solicitudgeneracion,
        solicitudaccesotoken,
      );
      if (tokenacceso == null) {
        await _limpiarsesion(solicitudgeneracion);
        handler.next(err);
        return;
      }
      await _reintentarsitokenvigente(
        solicitud,
        err,
        solicitudgeneracion,
        handler,
      );
    } on DioException catch (refreshError) {
      if (refreshError.response?.statusCode == 401 &&
          _estadosesion.generacion == solicitudgeneracion) {
        await _limpiarsesion(solicitudgeneracion);
      }
      handler.next(refreshError);
    } on _sesioncambiadaduranterenovacion {
      handler.next(err);
    } catch (_) {
      await _limpiarsesion(solicitudgeneracion);
      handler.next(err);
    }
  }

  Future<void> _reintentarsitokenvigente(
    RequestOptions solicitud,
    DioException originalerror,
    int solicitudgeneracion,
    ErrorInterceptorHandler manejador,
  ) async {
    solicitud.extra[clavereintentoautenticacion] = true;
    try {
      final respuesta = await _clienteapi.fetch<dynamic>(solicitud);
      manejador.resolve(respuesta);
    } on DioException catch (retryError) {
      if (retryError.response?.statusCode == 401 &&
          _estadosesion.generacion == solicitudgeneracion) {
        await _limpiarsesion(solicitudgeneracion);
      }
      manejador.next(retryError);
    } catch (_) {
      manejador.next(originalerror);
    }
  }

  Future<String?> _renovartokenacceso(
    int generacion,
    String? tokenaccesofallido,
  ) async {
    final existing = renovacionesencurso[generacion];
    if (existing != null) return existing;

    final pending = _ejecutarrenovacion(tokenaccesofallido, generacion);
    renovacionesencurso[generacion] = pending;
    try {
      return await pending;
    } finally {
      if (identical(renovacionesencurso[generacion], pending)) {
        renovacionesencurso.remove(generacion);
      }
    }
  }

  Future<String?> _ejecutarrenovacion(
    String? tokenaccesofallido,
    int generacion,
  ) async {
    final tokens = await _estadosesion.leertokensivigente(
      storage: _servicioalmacenamiento,
      generacion: generacion,
    );
    if (tokens == null) throw const _sesioncambiadaduranterenovacion();

    final tokenaccesoactual = tokens.accessToken;
    if (tokenaccesoactual != null &&
        tokenaccesoactual.isNotEmpty &&
        tokenaccesoactual != tokenaccesofallido) {
      return tokenaccesoactual;
    }

    final tokenrenovacion = tokens.refreshToken;
    if (tokenrenovacion == null || tokenrenovacion.isEmpty) return null;

    final respuesta = await _clienterenovacion.post<dynamic>(
      '/auth/refresh',
      data: <String, String>{'refreshToken': tokenrenovacion},
    );
    final cuerpo = respuesta.data;
    final datos = cuerpo is Map ? cuerpo['data'] : null;
    if (datos is! Map ||
        datos['accessToken'] is! String ||
        datos['refreshToken'] is! String) {
      throw const FormatException(
        'La respuesta de renovación de sesión no es válida.',
      );
    }

    final tokenacceso = datos['accessToken'] as String;
    final guardado = await _estadosesion.guardartokensrenovados(
      storage: _servicioalmacenamiento,
      generation: generacion,
      expectedRefreshToken: tokenrenovacion,
      accessToken: tokenacceso,
      tokenrenovacion: datos['refreshToken'] as String,
    );
    if (!guardado) throw const _sesioncambiadaduranterenovacion();
    return tokenacceso;
  }

  Future<void> _limpiarsesion(int generacionesperada) async {
    if (_estadosesion.generacion != generacionesperada) return;
    final logoutgeneracion = _estadosesion.iniciarcierresesion();
    try {
      await _estadosesion.limpiaramacenamiento(
        _servicioalmacenamiento,
        generacion: logoutgeneracion,
      );
    } catch (_) {
      // Propaga el error HTTP aunque falle el almacenamiento local.
    }
  }

  String? _solicitartokenacceso(RequestOptions solicitud) {
    final authorization = solicitud.headers['Authorization']?.toString();
    if (authorization == null || !authorization.startsWith('Bearer ')) {
      return null;
    }
    return authorization.substring('Bearer '.length);
  }

  bool _essolicitudautenticacion(String ruta) {
    final solicitudruta = Uri.tryParse(ruta)?.path ?? ruta;
    return solicitudruta.replaceFirst(RegExp(r'^/'), '').startsWith('auth/');
  }
}

class _sesioncambiadaduranterenovacion implements Exception {
  const _sesioncambiadaduranterenovacion();
}
