class AppConfig {
  static const String appName = 'Gestión Académica Móvil';
  static const String apiBaseUrl = 'http://10.0.2.2:3000/api/v1'; // 10.0.2.2 para Android Emulator, localhost para Web/iOS
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
