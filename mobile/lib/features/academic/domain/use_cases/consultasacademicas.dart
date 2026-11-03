import '../entities/registrosacademicos.dart';
import '../repositories/repositorioacademico.dart';

class casoobtenerestudiantesencache {
  const casoobtenerestudiantesencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<List<resumendeestudiante>>> ejecutar() =>
      _repositorio.obtenerestudiantesencache();
}

class casoobtenercalificacionesencache {
  const casoobtenercalificacionesencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<List<resumendecalificacion>>> ejecutar({
    String? identificadorestudiante,
  }) => _repositorio.getGradesWithCache(
    identificadorestudiante: identificadorestudiante,
  );
}

class casoobtenerasistenciaencache {
  const casoobtenerasistenciaencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<List<resumendeasistencia>>> ejecutar({
    String? identificadorestudiante,
  }) => _repositorio.obtenerasistenciaencache(
    identificadorestudiante: identificadorestudiante,
  );
}

class casoobteneralertasencache {
  const casoobteneralertasencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<List<resumendealerta>>> ejecutar() =>
      _repositorio.obteneralertasencache();
}

class casoobtenerasignacionesencache {
  const casoobtenerasignacionesencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<List<resumendeasignacion>>> ejecutar({
    String? idcurso,
    String? idmateria,
  }) => _repositorio.obtenerasignacionesencache(
    idcurso: idcurso,
    idmateria: idmateria,
  );
}

class casoobtenercomunicadosencache {
  const casoobtenercomunicadosencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<List<resumendecomunicado>>> ejecutar() =>
      _repositorio.obtenercomunicadosencache();
}

class casoobtenermihorarioencache {
  const casoobtenermihorarioencache(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<resultadoencache<horariomi>> ejecutar() =>
      _repositorio.obtenermihorarioencache();
}

class casosolicitarentrevista {
  const casosolicitarentrevista(this._repositorio);

  final puertorepositorioacademico _repositorio;

  Future<void> ejecutar({
    required String idestudiante,
    required String nombreestudiante,
    required String docenteomateria,
    required String fecha,
    required String motivo,
  }) => _repositorio.solicitarentrevista(
    idestudiante: idestudiante,
    nombreestudiante: nombreestudiante,
    docenteomateria: docenteomateria,
    fecha: fecha,
    motivo: motivo,
  );
}
