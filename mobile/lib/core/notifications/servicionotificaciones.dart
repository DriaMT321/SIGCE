import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class servicionotificaciones {
  final FlutterLocalNotificationsPlugin complementonotificaciones =
      FlutterLocalNotificationsPlugin();

  Future<void> inicializar() async {
    const AndroidInitializationSettings initializationsettingsandroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationsettingsdarwin =
        DarwinInitializationSettings(
          requestAlertPermission: true,
          requestBadgePermission: true,
          requestSoundPermission: true,
        );

    const InitializationSettings initializationsettings =
        InitializationSettings(
          android: initializationsettingsandroid,
          iOS: initializationsettingsdarwin,
        );

    await complementonotificaciones.initialize(
      initializationsettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // Manejar toque en notificación
      },
    );
  }

  Future<void> mostrarnotificacion({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const AndroidNotificationDetails
    androiddetails = AndroidNotificationDetails(
      'academic_alerts_channel',
      'Alertas Académicas',
      channelDescription:
          'Notificaciones de calificaciones, asistencias y avisos del colegio',
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
    );

    const DarwinNotificationDetails darwindetails = DarwinNotificationDetails();

    const NotificationDetails platformdetails = NotificationDetails(
      android: androiddetails,
      iOS: darwindetails,
    );

    await complementonotificaciones.show(
      id,
      title,
      body,
      platformdetails,
      payload: payload,
    );
  }
}
