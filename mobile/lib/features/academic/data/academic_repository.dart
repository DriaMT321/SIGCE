import '../../../core/network/api_client.dart';

class AcademicRepository {
  AcademicRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<List<StudentSummary>> getStudents() async {
    final response = await _apiClient.client.get('/students', queryParameters: {'limit': 100});
    final items = _list(response.data);
    return items.map(StudentSummary.fromJson).toList();
  }

  Future<List<GradeSummary>> getGrades({String? studentId}) async {
    final response = await _apiClient.client.get('/grades', queryParameters: {'studentId': studentId, 'limit': 200});
    final items = _list(response.data);
    return items.map(GradeSummary.fromJson).toList();
  }

  Future<List<AttendanceSummary>> getAttendance({String? studentId}) async {
    final response = await _apiClient.client.get('/attendance', queryParameters: {'studentId': studentId, 'limit': 200});
    final items = _list(response.data);
    return items.map(AttendanceSummary.fromJson).toList();
  }

  Future<List<AlertSummary>> getAlerts() async {
    final response = await _apiClient.client.get('/alerts', queryParameters: {'limit': 100});
    final items = _list(response.data);
    return items.map(AlertSummary.fromJson).toList();
  }

  List<Map<String, dynamic>> _list(dynamic body) {
    if (body is! Map<String, dynamic> || body['data'] is! List<dynamic>) {
      throw const AcademicException('La respuesta del servidor no es válida.');
    }
    return (body['data'] as List<dynamic>).whereType<Map<String, dynamic>>().toList();
  }
}

class StudentSummary {
  StudentSummary({required this.id, required this.name, required this.rude, required this.courseName});

  final String id;
  final String name;
  final String rude;
  final String courseName;

  factory StudentSummary.fromJson(Map<String, dynamic> json) {
    final enrollments = json['enrollments'];
    final firstEnrollment = enrollments is List<dynamic> && enrollments.isNotEmpty && enrollments.first is Map<String, dynamic>
        ? enrollments.first as Map<String, dynamic>
        : <String, dynamic>{};
    final course = firstEnrollment['course'] is Map<String, dynamic> ? firstEnrollment['course'] as Map<String, dynamic> : <String, dynamic>{};
    return StudentSummary(
      id: _requiredString(json, 'id'),
      name: '${_requiredString(json, 'firstName')} ${_requiredString(json, 'lastName')}',
      rude: _requiredString(json, 'rude'),
      courseName: course['name']?.toString() ?? 'Sin matrícula',
    );
  }
}

class GradeSummary {
  GradeSummary({required this.subject, required this.period, required this.value, required this.studentName});

  final String subject;
  final String period;
  final double value;
  final String studentName;

  factory GradeSummary.fromJson(Map<String, dynamic> json) {
    final subject = json['subject'] is Map<String, dynamic> ? json['subject'] as Map<String, dynamic> : <String, dynamic>{};
    final period = json['period'] is Map<String, dynamic> ? json['period'] as Map<String, dynamic> : <String, dynamic>{};
    final student = json['student'] is Map<String, dynamic> ? json['student'] as Map<String, dynamic> : <String, dynamic>{};
    return GradeSummary(
      subject: subject['name']?.toString() ?? 'Materia',
      period: period['name']?.toString() ?? 'Periodo',
      value: (json['value'] as num?)?.toDouble() ?? 0,
      studentName: '${student['firstName'] ?? ''} ${student['lastName'] ?? ''}'.trim(),
    );
  }
}

class AttendanceSummary {
  AttendanceSummary({required this.date, required this.status, required this.studentName, this.justification});

  final DateTime date;
  final String status;
  final String studentName;
  final String? justification;

  factory AttendanceSummary.fromJson(Map<String, dynamic> json) {
    final student = json['student'] is Map<String, dynamic> ? json['student'] as Map<String, dynamic> : <String, dynamic>{};
    return AttendanceSummary(
      date: DateTime.tryParse(json['date']?.toString() ?? '') ?? DateTime.now(),
      status: json['status']?.toString() ?? 'UNKNOWN',
      studentName: '${student['firstName'] ?? ''} ${student['lastName'] ?? ''}'.trim(),
      justification: json['justification']?.toString(),
    );
  }
}

class AlertSummary {
  AlertSummary({required this.title, required this.message, required this.severity, required this.createdAt, required this.isRead});

  final String title;
  final String message;
  final String severity;
  final DateTime createdAt;
  final bool isRead;

  factory AlertSummary.fromJson(Map<String, dynamic> json) => AlertSummary(
        title: json['title']?.toString() ?? 'Alerta',
        message: json['message']?.toString() ?? '',
        severity: json['severity']?.toString() ?? 'INFO',
        createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ?? DateTime.now(),
        isRead: json['isRead'] == true,
      );
}

class AcademicException implements Exception {
  const AcademicException(this.message);

  final String message;
}

String _requiredString(Map<String, dynamic> json, String key) {
  final value = json[key];
  if (value is! String || value.isEmpty) {
    throw AcademicException('Falta el campo $key en la respuesta.');
  }
  return value;
}
