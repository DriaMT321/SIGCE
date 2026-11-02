import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/academic/domain/use_cases/consultasacademicas.dart';
import '../../features/academic/data/academic_repository.dart';
import '../../features/academic/domain/repositories/repositorioacademico.dart';
import '../network/clienteapi.dart';
import '../storage/servicioalmacenamientoseguro.dart';

final proveedoralmacenamientoseguro = Provider<seguroalmacenamientoservicio>(
  (ref) => seguroalmacenamientoservicio(),
);

final proveedorclienteapi = Provider<clienteapi>(
  (ref) => clienteapi(ref.watch(proveedoralmacenamientoseguro)),
);

final proveedorrepositorioacademico = Provider<puertorepositorioacademico>(
  (ref) => AcademicRepository(
    ref.watch(proveedorclienteapi),
    ref.watch(proveedoralmacenamientoseguro),
  ),
);

final proveedorobtenerestudiantesencache =
    Provider<casoobtenerestudiantesencache>(
      (ref) => casoobtenerestudiantesencache(
        ref.watch(proveedorrepositorioacademico),
      ),
    );

final proveedorobtenercalificacionesencache =
    Provider<casoobtenercalificacionesencache>(
      (ref) => casoobtenercalificacionesencache(
        ref.watch(proveedorrepositorioacademico),
      ),
    );

final proveedorobtenerasistenciaencache =
    Provider<casoobtenerasistenciaencache>(
      (ref) => casoobtenerasistenciaencache(
        ref.watch(proveedorrepositorioacademico),
      ),
    );

final proveedorobteneralertasencache = Provider<casoobteneralertasencache>(
  (ref) => casoobteneralertasencache(ref.watch(proveedorrepositorioacademico)),
);
