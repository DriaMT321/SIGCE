import '../domain/entities/registrosacademicos.dart';
import '../domain/repositories/repositorioacademico.dart';

Future<resultadoencache<List<periodoacademico>>> obtenerperiodosopcionales(
  puertorepositorioacademico repositorio,
) {
  return repositorio.obtenerperiodosencache();
}
