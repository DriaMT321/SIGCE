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
      observaciones: json['remarks'] as String?,
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
    titulo: _cadenadefecto(json, 'title', 'Alerta'),
    mensaje: _cadenadefecto(json, 'message', ''),
    gravedad: _cadenadefecto(json, 'severity', 'INFO'),
    fechacreacion: _fechadefecto(json, 'createdAt'),
    estaleida: json['isRead'] is bool ? json['isRead'] as bool : false,
  );

  static resumendeasignacion asignacion(Map<String, dynamic> json) {
    final materia = json['subject'] is Map<String, dynamic>
        ? json['subject'] as Map<String, dynamic>
        : <String, dynamic>{};
    final docente = json['teacher'] is Map<String, dynamic>
        ? json['teacher'] as Map<String, dynamic>
        : <String, dynamic>{};
    final estudiante = json['student'] is Map<String, dynamic>
        ? json['student'] as Map<String, dynamic>
        : null;
    final submission = json['submission'] is Map<String, dynamic>
        ? json['submission'] as Map<String, dynamic>
        : null;
    final notaObtenida = submission != null && submission['score'] is num
        ? (submission['score'] as num).toDouble()
        : null;
    final retroalimentacion = submission?['feedback'] as String?;
    final fechaCalificacion = submission?['gradedAt'] != null
        ? DateTime.tryParse(submission!['gradedAt'].toString())
        : null;

    final docentename = docente['firstName'] != null
        ? '${docente['firstName']} ${docente['lastName'] ?? ''}'.trim()
        : (docente['user'] is Map<String, dynamic>
            ? '${(docente['user'] as Map<String, dynamic>)['firstName'] ?? ''} ${(docente['user'] as Map<String, dynamic>)['lastName'] ?? ''}'.trim()
            : 'Docente titular');

    return resumendeasignacion(
      identificador: _cadenadefecto(json, 'id', ''),
      titulo: _cadenadefecto(json, 'title', 'Sin título'),
      tipo: _cadenadefecto(json, 'type', 'TAREA'),
      descripcion: _cadenadefecto(json, 'description', ''),
      fechalimite: _fechadefecto(json, 'dueDate'),
      puntajemaximo: json['maxScore'] is num
          ? (json['maxScore'] as num).toDouble()
          : 100.0,
      estado: _cadenadefecto(json, 'status', 'PENDIENTE'),
      nombremateria: _cadenadefecto(materia, 'name', 'Materia general'),
      nombredocente: docentename.isNotEmpty ? docentename : 'Profesor',
      nombreestudiante: estudiante != null
          ? '${estudiante['firstName'] ?? ''} ${estudiante['lastName'] ?? ''}'.trim()
          : null,
      notaObtenida: notaObtenida,
      retroalimentacion: retroalimentacion,
      fechaCalificacion: fechaCalificacion,
    );
  }

  static resumendecomunicado comunicado(Map<String, dynamic> json) {
    final autor = json['author'] is Map<String, dynamic>
        ? json['author'] as Map<String, dynamic>
        : <String, dynamic>{};
    final autornombre = autor['firstName'] != null
        ? '${autor['firstName']} ${autor['lastName'] ?? ''}'.trim()
        : 'Dirección U.E. Comunidad Cristiana';

    return resumendecomunicado(
      identificador: _cadenadefecto(json, 'id', ''),
      titulo: _cadenadefecto(json, 'title', 'Comunicado institucional'),
      contenido: _cadenadefecto(json, 'content', ''),
      prioridad: _cadenadefecto(json, 'priority', 'MEDIA'),
      fechacreacion: _fechadefecto(json, 'createdAt'),
      autornombre: autornombre,
      alcance: json['scope'] as String?,
    );
  }

  static sesionhorario sesion(Map<String, dynamic> json) {
    final materia = json['subject'] is Map<String, dynamic>
        ? json['subject'] as Map<String, dynamic>
        : <String, dynamic>{};
    final docente = json['teacher'] is Map<String, dynamic>
        ? json['teacher'] as Map<String, dynamic>
        : <String, dynamic>{};
    final docentename = docente['firstName'] != null
        ? '${docente['firstName']} ${docente['lastName'] ?? ''}'.trim()
        : 'Docente';

    return sesionhorario(
      identificador: _cadenadefecto(json, 'id', ''),
      diasemana: _cadenadefecto(json, 'dayOfWeek', 'LUNES'),
      horainicio: _cadenadefecto(json, 'startTime', '08:00'),
      horafin: _cadenadefecto(json, 'endTime', '08:45'),
      periodoindice: json['periodIndex'] is int ? json['periodIndex'] as int : 1,
      materia: _cadenadefecto(materia, 'name', 'Asignatura'),
      docente: docentename,
      aula: json['classroom'] as String?,
    );
  }

  static horariomi parsearhorariomi(Map<String, dynamic> json) {
    final tipo = _cadenadefecto(json, 'type', 'student');
    final cursoObj = json['course'] is Map<String, dynamic>
        ? json['course'] as Map<String, dynamic>
        : <String, dynamic>{};
    final cursoNombre = _cadenadefecto(cursoObj, 'name', 'Curso asignado');

    final schedulesList = json['schedules'] is List<dynamic>
        ? (json['schedules'] as List<dynamic>)
            .whereType<Map<String, dynamic>>()
            .map(sesion)
            .toList()
        : <sesionhorario>[];

    final hijosList = <horariohijo>[];
    if (json['children'] is List<dynamic>) {
      for (final hijoJson in (json['children'] as List<dynamic>)) {
        if (hijoJson is Map<String, dynamic>) {
          final studentObj = hijoJson['student'] is Map<String, dynamic>
              ? hijoJson['student'] as Map<String, dynamic>
              : <String, dynamic>{};
          final childCourse = hijoJson['course'] is Map<String, dynamic>
              ? hijoJson['course'] as Map<String, dynamic>
              : <String, dynamic>{};
          final childSchedules = hijoJson['schedules'] is List<dynamic>
              ? (hijoJson['schedules'] as List<dynamic>)
                  .whereType<Map<String, dynamic>>()
                  .map(sesion)
                  .toList()
              : <sesionhorario>[];

          hijosList.add(
            horariohijo(
              idestudiante: _cadenadefecto(studentObj, 'id', ''),
              nombreestudiante:
                  '${_cadenadefecto(studentObj, 'firstName', '')} ${_cadenadefecto(studentObj, 'lastName', '')}'.trim(),
              rude: _cadenadefecto(studentObj, 'rude', ''),
              nombrecurso: _cadenadefecto(childCourse, 'name', 'Curso regular'),
              sesiones: childSchedules,
            ),
          );
        }
      }
    }

    return horariomi(
      tipo: tipo,
      nombrecurso: cursoNombre,
      sesiones: schedulesList,
      hijoshorarios: hijosList,
    );
  }

  static String _cadenarequerida(Map<String, dynamic> json, String key) {
    final valor = json[key];
    if (valor is! String || valor.trim().isEmpty) {
      throw excepcionacademica('Falta el campo $key en la respuesta.');
    }
    return valor;
  }

  static String _cadenadefecto(Map<String, dynamic> json, String key, String defecto) {
    final valor = json[key];
    if (valor is String && valor.trim().isNotEmpty) return valor;
    return defecto;
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

  static DateTime _fechadefecto(Map<String, dynamic> json, String key) {
    final valor = json[key];
    if (valor is String) {
      final fecha = DateTime.tryParse(valor);
      if (fecha != null) return fecha;
    }
    return DateTime.now();
  }

  static bool _booleanorequerido(Map<String, dynamic> json, String key) {
    final valor = json[key];
    if (valor is! bool) {
      throw excepcionacademica('El campo $key de la respuesta no es válido.');
    }
    return valor;
  }
}
