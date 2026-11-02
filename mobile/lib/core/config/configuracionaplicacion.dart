import 'package:flutter/foundation.dart';

class configuracionaplicacion {
  static const String nombreaplicacion = 'Gestión Académica Móvil';
  static const String _urlbaseapi = String.fromEnvironment(
    'SIGCE_API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );
  static String get urlbaseapi {
    final ruta = Uri.tryParse(_urlbaseapi);
    if (kReleaseMode &&
        (ruta == null || ruta.scheme != 'https' || ruta.host.isEmpty)) {
      throw StateError(
        'La versión de producción de SIGCE requiere SIGCE_API_BASE_URL con HTTPS.',
      );
    }
    return _urlbaseapi;
  }

  static const Duration tiempolimiteconexion = Duration(seconds: 15);
  static const Duration tiempolimiteespera = Duration(seconds: 15);
}
