import '../policies/politicacalificacion.dart';

class resultadoencache<T> {
  const resultadoencache({
    required this.datos,
    required this.estaoffline,
    this.fechaencache,
  });

  final T datos;
  final bool estaoffline;
  final DateTime? fechaencache;

  String get fechaactualizacionformateada {
    if (fechaencache == null) return '';
    final fecha = fechaencache!;
    final day = fecha.day.toString().padLeft(2, '0');
    final month = fecha.month.toString().padLeft(2, '0');
    final year = fecha.year.toString();
    final hour = fecha.hour.toString().padLeft(2, '0');
    final minute = fecha.minute.toString().padLeft(2, '0');
    return 'Actualizado al $day/$month/$year $hour:$minute';
  }
}

class resumendeestudiante {
  const resumendeestudiante({
    required this.identificador,
    required this.nombre,
    required this.rude,
    required this.nombrecurso,
  });

  final String identificador;
  final String nombre;
  final String rude;
  final String nombrecurso;
}

class resumendecalificacion {
  const resumendecalificacion({
    required this.materia,
    required this.periodo,
    required this.valor,
    required this.nombreestudiante,
    this.identificadorperiodo,
    this.observaciones,
  });

  final String materia;
  final String periodo;
  final double valor;
  final String nombreestudiante;
  final String? identificadorperiodo;
  final String? observaciones;

  bool get estaaprobada => politicanotas.estaaprobada(valor);
}

class periodoacademico {
  const periodoacademico({
    required this.identificador,
    required this.nombre,
    required this.gestionid,
    required this.gestion,
    required this.gestionactiva,
    required this.inicio,
    required this.fin,
  });

  final String identificador;
  final String nombre;
  final String gestionid;
  final int gestion;
  final bool gestionactiva;
  final DateTime inicio;
  final DateTime fin;

  bool contiene(DateTime fecha) {
    final dia = DateTime.utc(fecha.year, fecha.month, fecha.day);
    final desde = DateTime.utc(inicio.year, inicio.month, inicio.day);
    final hasta = DateTime.utc(fin.year, fin.month, fin.day);
    return !dia.isBefore(desde) && !dia.isAfter(hasta);
  }
}

class resumendeasistencia {
  const resumendeasistencia({
    required this.fecha,
    required this.estado,
    required this.nombreestudiante,
    this.justificacion,
    this.identificadorgestion,
  });

  final DateTime fecha;
  final String estado; // PRESENTE, FALTA, ATRASO, LICENCIA
  final String nombreestudiante;
  final String? justificacion;
  final String? identificadorgestion;
}

class resumendealerta {
  const resumendealerta({
    required this.titulo,
    required this.mensaje,
    required this.gravedad,
    required this.fechacreacion,
    required this.estaleida,
  });

  final String titulo;
  final String mensaje;
  final String gravedad;
  final DateTime fechacreacion;
  final bool estaleida;
}

/// Tarea o Examen asignado por el profesor
class resumendeasignacion {
  const resumendeasignacion({
    required this.identificador,
    required this.titulo,
    required this.tipo, // TAREA, EXAMEN, TRABAJO_PRACTICO, PROYECTO, CONTROL_LECTURA
    required this.descripcion,
    required this.fechalimite,
    required this.puntajemaximo,
    required this.estado, // PENDIENTE, EN_PROGRESO, FINALIZADO, CANCELADO
    required this.nombremateria,
    required this.nombredocente,
    this.nombreestudiante,
  });

  final String identificador;
  final String titulo;
  final String tipo;
  final String descripcion;
  final DateTime fechalimite;
  final double puntajemaximo;
  final String estado;
  final String nombremateria;
  final String nombredocente;
  final String? nombreestudiante;

  String get tiponormalizado => switch (tipo) {
    'TAREA' => 'Tarea',
    'EXAMEN' => 'Examen',
    'TRABAJO_PRACTICO' => 'Trabajo Práctico',
    'PROYECTO' => 'Proyecto',
    'CONTROL_LECTURA' => 'Control de Lectura',
    _ => tipo,
  };

  bool get espendiente => estado == 'PENDIENTE' || estado == 'EN_PROGRESO';
  bool get esvencida => fechalimite.isBefore(DateTime.now()) && espendiente;
}

/// Comunicado o Aviso institucional / de curso
class resumendecomunicado {
  const resumendecomunicado({
    required this.identificador,
    required this.titulo,
    required this.contenido,
    required this.prioridad, // BAJA, MEDIA, ALTA, URGENTE
    required this.fechacreacion,
    required this.autornombre,
    this.alcance,
  });

  final String identificador;
  final String titulo;
  final String contenido;
  final String prioridad;
  final DateTime fechacreacion;
  final String autornombre;
  final String? alcance;
}

/// Bloque de horario escolar
class sesionhorario {
  const sesionhorario({
    required this.identificador,
    required this.diasemana, // LUNES, MARTES, MIERCOLES, JUEVES, VIERNES
    required this.horainicio,
    required this.horafin,
    required this.periodoindice,
    required this.materia,
    required this.docente,
    this.aula,
  });

  final String identificador;
  final String diasemana;
  final String horainicio;
  final String horafin;
  final int periodoindice;
  final String materia;
  final String docente;
  final String? aula;

  String get dialabel => switch (diasemana.toUpperCase()) {
    'LUNES' => 'Lunes',
    'MARTES' => 'Martes',
    'MIERCOLES' => 'Miércoles',
    'JUEVES' => 'Jueves',
    'VIERNES' => 'Viernes',
    _ => diasemana,
  };
}

/// Horario completo para el usuario
class horariomi {
  const horariomi({
    required this.tipo,
    required this.nombrecurso,
    required this.sesiones,
    this.hijoshorarios = const [],
  });

  final String tipo; // student, parent, teacher
  final String nombrecurso;
  final List<sesionhorario> sesiones;
  final List<horariohijo> hijoshorarios;
}

class horariohijo {
  const horariohijo({
    required this.idestudiante,
    required this.nombreestudiante,
    required this.rude,
    required this.nombrecurso,
    required this.sesiones,
  });

  final String idestudiante;
  final String nombreestudiante;
  final String rude;
  final String nombrecurso;
  final List<sesionhorario> sesiones;
}

/// Solicitud de Cita / Entrevista enviada por el tutor
class solicitudcita {
  const solicitudcita({
    required this.idestudiante,
    required this.nombreestudiante,
    required this.docenteomateria,
    required this.fechasolicitada,
    required this.motivo,
    required this.fecharegistro,
  });

  final String idestudiante;
  final String nombreestudiante;
  final String docenteomateria;
  final String fechasolicitada;
  final String motivo;
  final DateTime fecharegistro;
}
