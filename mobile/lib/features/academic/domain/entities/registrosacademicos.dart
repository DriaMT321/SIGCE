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
  });

  final String materia;
  final String periodo;
  final double valor;
  final String nombreestudiante;
  final String? identificadorperiodo;

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
  final String estado;
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
