# Pruebas locales de la aplicación móvil

La app consulta la API indicada mediante `SIGCE_API_BASE_URL`. En un emulador Android, `10.0.2.2` apunta al equipo que ejecuta la API:

```bash
flutter pub get
flutter run -t lib/principal.dart --dart-define=SIGCE_API_BASE_URL=http://10.0.2.2:3000/api/v1
```

El permiso de Internet se incluye en todas las variantes. En un emulador Android 7 o posterior, las variantes `debug` y `profile` admiten HTTP solamente hacia `10.0.2.2` para esta prueba local. La variante `release` bloquea HTTP: debe construirse con una dirección HTTPS accesible para el dispositivo, por ejemplo `--dart-define=SIGCE_API_BASE_URL=https://api.ejemplo.org/api/v1`.

Esta configuración permite probar los recorridos móviles con datos sintéticos y con el worker SIE local. No constituye una prueba de acceso al SIE oficial ni una aprobación institucional.
