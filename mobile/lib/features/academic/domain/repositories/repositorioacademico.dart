import '../entities/registrosacademicos.dart';

abstract interface class puertorepositorioacademico {
  Future<resultadoencache<List<periodoacademico>>> obtenerperiodosencache();
  Future<resultadoencache<List<resumendeestudiante>>> obtenerestudiantesencache();
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

  // Nuevas capacidades para estudiantes y padres
  Future<resultadoencache<List<resumendeasignacion>>> obtenerasignacionesencache({
    String? idcurso,
    String? idmateria,
  });
  Future<List<resumendeasignacion>> obtenerasignaciones({
    String? idcurso,
    String? idmateria,
  });

  Future<resultadoencache<List<resumendecomunicado>>> obtenercomunicadosencache();
  Future<List<resumendecomunicado>> obtenercomunicados();

  Future<resultadoencache<horariomi>> obtenermihorarioencache();
  Future<horariomi> obtenermihorario();

  Future<void> solicitarentrevista({
    required String idestudiante,
    required String nombreestudiante,
    required String docenteomateria,
    required String fecha,
    required String motivo,
  });
}
