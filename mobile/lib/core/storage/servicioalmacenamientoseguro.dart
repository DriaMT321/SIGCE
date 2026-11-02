import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class seguroalmacenamientoservicio {
  final FlutterSecureStorage almacenamiento = const FlutterSecureStorage();

  static const String clavetokenacceso = 'jwt_access_token';
  static const String clavetokenrenovacion = 'jwt_refresh_token';
  static const String clavedatosusuario = 'auth_user_data';

  Future<void> guardartokens({
    required String accessToken,
    required String tokenrenovacion,
  }) async {
    await almacenamiento.write(key: clavetokenacceso, value: accessToken);
    await almacenamiento.write(
      key: clavetokenrenovacion,
      value: tokenrenovacion,
    );
  }

  Future<String?> obtenertokenacceso() async {
    return await almacenamiento.read(key: clavetokenacceso);
  }

  Future<String?> obtenertokenrenovacion() async {
    return await almacenamiento.read(key: clavetokenrenovacion);
  }

  Future<void> guardardatosusuario(String datosusuariojson) async {
    await almacenamiento.write(key: clavedatosusuario, value: datosusuariojson);
  }

  Future<void> limpiardatosusuario() async {
    await almacenamiento.delete(key: clavedatosusuario);
  }

  Future<String?> obtenerdatosusuario() async {
    return await almacenamiento.read(key: clavedatosusuario);
  }

  Future<void> guardarcache(String key, String cadenajson) async {
    await almacenamiento.write(key: 'cache_$key', value: cadenajson);
    await almacenamiento.write(
      key: 'cache_time_$key',
      value: DateTime.now().toIso8601String(),
    );
  }

  Future<String?> obtenercache(String key) async {
    return await almacenamiento.read(key: 'cache_$key');
  }

  Future<DateTime?> obtenerfechacache(String key) async {
    final str = await almacenamiento.read(key: 'cache_time_$key');
    if (str == null) return null;
    return DateTime.tryParse(str);
  }

  Future<void> limpiarcache() async {
    final values = await almacenamiento.readAll();
    for (final key in values.keys) {
      if (key.startsWith('cache_')) await almacenamiento.delete(key: key);
    }
  }

  Future<void> limpiartodo() async {
    await almacenamiento.deleteAll();
  }
}
