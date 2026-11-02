import 'dart:async';

import 'package:flutter/foundation.dart';

import '../storage/servicioalmacenamientoseguro.dart';

class estadodesionautenticacion extends ChangeNotifier {
  estadodesionautenticacion._();

  static final estadodesionautenticacion instance = estadodesionautenticacion
      ._();

  bool _tienesesion = false;
  int _generacion = 0;
  Future<void> _tokenescrituracola = Future<void>.value();

  bool get tienesesion => _tienesesion;
  int get generacion => _generacion;

  Future<void> inicializar(seguroalmacenamientoservicio almacenamiento) async {
    _establecersesion(
      (await almacenamiento.obtenertokenacceso())?.isNotEmpty ?? false,
    );
  }

  Future<int?> reemplazarsesion({
    required seguroalmacenamientoservicio storage,
    required String accessToken,
    required String tokenrenovacion,
  }) async {
    final generacion = ++_generacion;
    _establecersesion(false);
    final guardado = await _serializarescrituratoken(() async {
      if (_generacion != generacion) return null;
      await storage.limpiarcache();
      await storage.limpiardatosusuario();
      if (_generacion != generacion) return null;
      await storage.guardartokens(
        accessToken: accessToken,
        tokenrenovacion: tokenrenovacion,
      );
      return _generacion == generacion ? generacion : null;
    });
    if (guardado != null && _generacion == generacion) _establecersesion(true);
    return guardado == _generacion ? guardado : null;
  }

  int iniciarcierresesion() {
    final generacion = ++_generacion;
    _establecersesion(false);
    return generacion;
  }

  bool essesionvigente(int generacion) =>
      _tienesesion && _generacion == generacion;

  Future<String?> leercachesivigente({
    required seguroalmacenamientoservicio storage,
    required int generation,
    required String cachekey,
  }) {
    return _serializarescrituratoken(() async {
      if (!essesionvigente(generation)) return null;
      final cache = await storage.obtenercache(cachekey);
      return essesionvigente(generation) ? cache : null;
    });
  }

  Future<DateTime?> leerfechacachesivigente({
    required seguroalmacenamientoservicio storage,
    required int generation,
    required String cachekey,
  }) {
    return _serializarescrituratoken(() async {
      if (!essesionvigente(generation)) return null;
      final fechahora = await storage.obtenerfechacache(cachekey);
      return essesionvigente(generation) ? fechahora : null;
    });
  }

  Future<bool> guardarcachesivigente({
    required seguroalmacenamientoservicio storage,
    required int generation,
    required String cacheKey,
    required String cadenajson,
  }) {
    return _serializarescrituratoken(() async {
      if (!essesionvigente(generation)) return false;
      await storage.guardarcache(cacheKey, cadenajson);
      return essesionvigente(generation);
    });
  }

  Future<bool> guardardatosusuariosivigente({
    required seguroalmacenamientoservicio storage,
    required int generation,
    required String accessToken,
    required String datosusuariojson,
  }) {
    return _serializarescrituratoken(() async {
      if (!essesionvigente(generation)) return false;
      if (await storage.obtenertokenacceso() != accessToken) return false;
      if (!essesionvigente(generation)) return false;
      await storage.guardardatosusuario(datosusuariojson);
      return essesionvigente(generation);
    });
  }

  Future<String?> leertokenrenovacion(
    seguroalmacenamientoservicio almacenamiento,
  ) {
    return _serializarescrituratoken(almacenamiento.obtenertokenrenovacion);
  }

  Future<({String? accessToken, String? refreshToken})?> leertokensivigente({
    required seguroalmacenamientoservicio storage,
    required int generacion,
  }) {
    return _serializarescrituratoken(() async {
      if (!essesionvigente(generacion)) return null;
      final tokenacceso = await storage.obtenertokenacceso();
      final tokenrenovacion = await storage.obtenertokenrenovacion();
      if (!essesionvigente(generacion)) return null;
      return (accessToken: tokenacceso, refreshToken: tokenrenovacion);
    });
  }

  Future<void> limpiaramacenamiento(
    seguroalmacenamientoservicio almacenamiento, {
    required int generacion,
  }) {
    return _serializarescrituratoken(() async {
      if (_generacion == generacion) await almacenamiento.limpiartodo();
    });
  }

  Future<bool> guardartokensrenovados({
    required seguroalmacenamientoservicio storage,
    required int generation,
    required String expectedRefreshToken,
    required String accessToken,
    required String tokenrenovacion,
  }) {
    return _serializarescrituratoken(() async {
      if (_generacion != generation) return false;
      if (await storage.obtenertokenrenovacion() != expectedRefreshToken) {
        return false;
      }
      if (_generacion != generation) return false;
      await storage.guardartokens(
        accessToken: accessToken,
        tokenrenovacion: tokenrenovacion,
      );
      return _generacion == generation;
    });
  }

  Future<T> _serializarescrituratoken<T>(Future<T> Function() operation) async {
    final previouswrite = _tokenescrituracola;
    final completed = Completer<void>();
    _tokenescrituracola = completed.future;
    await previouswrite;
    try {
      return await operation();
    } finally {
      completed.complete();
    }
  }

  void _establecersesion(bool hassession) {
    if (_tienesesion == hassession) return;
    _tienesesion = hassession;
    notifyListeners();
  }
}
