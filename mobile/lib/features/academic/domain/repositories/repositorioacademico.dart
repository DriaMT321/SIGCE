import '../entities/registrosacademicos.dart';

abstract interface class puertorepositorioacademico {
  Future<resultadoencache<List<periodoacademico>>> obtenerperiodosencache();
  Future<resultadoencache<List<resumendeestudiante>>>
  obtenerestudiantesencache();
  Future<List<resumendeestudiante>> obtenerestudiantes();
  Future<resultadoencache<List<resumendecalificacion>>> getGradesWithCache({
    String? identificadorestudiante,
  });
  Future<List<resumendecalificacion>> obtenercalificaciones({
    String? identificadorestudiante,
  });
  Future<resultadoencache<List<resumendeasistencia>>> obtenerasistenciaencache({
    String? identificadorestudiante,
  });
  Future<List<resumendeasistencia>> obtenerasistencia({
    String? identificadorestudiante,
  });
  Future<resultadoencache<List<resumendealerta>>> obteneralertasencache();
  Future<List<resumendealerta>> obteneralertas();
}
