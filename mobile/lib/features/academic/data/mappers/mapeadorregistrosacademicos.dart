import '../../domain/entities/registrosacademicos.dart';
import '../../domain/exceptions/excepcionacademica.dart';

class mapeadorregistrosacademicos {
  static resumendeestudiante estudiante(Map<String, dynamic> json) {
    final enrollments = json['enrollments'];
    var nombrecurso = 'Sin matrícula';
    if (enrollments != null && enrollments is! List<dynamic>) {
      throw const excepcionacademica(
        'Las matrículas del estudiante no son válidas.',
      );
    }
    if (enrollments is List<dynamic> && enrollments.isNotEmpty) {
      final enrollment = _objetorequerido(enrollments.first, 'enrollments');
      final curso = _objetorequerido(enrollment['course'], 'course');
      nombrecurso = _cadenarequerida(curso, 'name');
    }
    return resumendeestudiante(
      identificador: _cadenarequerida(json, 'id'),
      nombre:
          '${_cadenarequerida(json, 'firstName')} ${_cadenarequerida(json, 'lastName')}',
      rude: _cadenarequerida(json, 'rude'),
      nombrecurso: nombrecurso,
    );
  }

  static resumendecalificacion calificacion(Map<String, dynamic> json) {
    final materia = _objetorequerido(json['subject'], 'subject');
    final periodo = _objetorequerido(json['period'], 'period');
    final estudiante = _objetorequerido(json['student'], 'student');
    final valor = json['value'];
    if (valor is! num || !valor.isFinite) {
      throw const excepcionacademica('La calificación recibida no es válida.');
    }
    return resumendecalificacion(
      materia: _cadenarequerida(materia, 'name'),
      periodo: _cadenarequerida(periodo, 'name'),
      identificadorperiodo: periodo['id'] as String?,
      valor: valor.toDouble(),
      nombreestudiante:
          '${_cadenarequerida(estudiante, 'firstName')} ${_cadenarequerida(estudiante, 'lastName')}',
    );
  }

  static periodoacademico periodo(Map<String, dynamic> json) {
    final gestion = _objetorequerido(json['academicYear'], 'academicYear');
    final anio = gestion['year'];
    if (anio is! int) {
      throw const excepcionacademica('El año de la gestión no es válido.');
    }
    final inicio = _fecharequerida(json, 'startDate');
    final fin = _fecharequerida(json, 'endDate');
    if (fin.isBefore(inicio)) {
      throw const excepcionacademica('Las fechas del período no son válidas.');
    }
    return periodoacademico(
      identificador: _cadenarequerida(json, 'id'),
      nombre: _cadenarequerida(json, 'name'),
      gestionid: _cadenarequerida(json, 'academicYearId'),
      gestion: anio,
      gestionactiva: _booleanorequerido(gestion, 'isActive'),
      inicio: inicio,
      fin: fin,
    );
  }

  static resumendeasistencia asistencia(Map<String, dynamic> json) {
    final estudiante = _objetorequerido(json['student'], 'student');
    final justificacion = json['justification'];
    if (justificacion != null && justificacion is! String) {
      throw const excepcionacademica(
        'La justificación de asistencia no es válida.',
      );
    }
    return resumendeasistencia(
      fecha: _fecharequerida(json, 'date'),
      estado: _cadenarequerida(json, 'status'),
      nombreestudiante:
          '${_cadenarequerida(estudiante, 'firstName')} ${_cadenarequerida(estudiante, 'lastName')}',
      justificacion: justificacion,
      identificadorgestion: json['course'] is Map<String, dynamic>
          ? (json['course'] as Map<String, dynamic>)['academicYearId']
                as String?
          : null,
    );
  }

  static resumendealerta alerta(Map<String, dynamic> json) => resumendealerta(
    titulo: _cadenarequerida(json, 'title'),
    mensaje: _cadenarequerida(json, 'message'),
    gravedad: _cadenarequerida(json, 'severity'),
    fechacreacion: _fecharequerida(json, 'createdAt'),
    estaleida: _booleanorequerido(json, 'isRead'),
  );

  static String _cadenarequerida(Map<String, dynamic> json, String key) {
    final valor = json[key];
    if (valor is! String || valor.trim().isEmpty) {
      throw excepcionacademica('Falta el campo $key en la respuesta.');
    }
    return valor;
  }

  static Map<String, dynamic> _objetorequerido(dynamic valor, String key) {
    if (valor is! Map<String, dynamic>) {
      throw excepcionacademica('Falta el objeto $key en la respuesta.');
    }
    return valor;
  }

  static DateTime _fecharequerida(Map<String, dynamic> json, String key) {
    final valor = json[key];
    final fecha = valor is String ? DateTime.tryParse(valor) : null;
    if (fecha == null) {
      throw excepcionacademica('La fecha $key de la respuesta no es válida.');
    }
    return fecha;
  }

  static bool _booleanorequerido(Map<String, dynamic> json, String key) {
    final valor = json[key];
    if (valor is! bool) {
      throw excepcionacademica('El campo $key de la respuesta no es válido.');
    }
    return valor;
  }
}
