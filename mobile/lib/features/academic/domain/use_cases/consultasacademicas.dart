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
