import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/domain/use_cases/casosdeusoautenticacion.dart';
import '../../features/auth/data/repositorioautenticacion.dart';
import '../../features/auth/domain/puertoautenticacion.dart';
import './proveedoresacademicos.dart';

final proveedorpuertoautenticacion = Provider<puertodeautenticacion>(
  (ref) => repositorioautenticacion(
    ref.watch(proveedorclienteapi),
    ref.watch(proveedoralmacenamientoseguro),
  ),
);

final proveedorcasodeusoiniciarsesion = Provider<casodeusoiniciarsesion>(
  (ref) => casodeusoiniciarsesion(ref.watch(proveedorpuertoautenticacion)),
);

final proveedorcasodeusoactivarestudiante =
    Provider<casodeusoactivarestudiante>(
      (ref) =>
          casodeusoactivarestudiante(ref.watch(proveedorpuertoautenticacion)),
    );

final proveedorcasodeusocerrarsesion = Provider<casodeusocerrarsesion>(
  (ref) => casodeusocerrarsesion(ref.watch(proveedorpuertoautenticacion)),
);

final proveedorcasodeusoobtenerperfilusuarioactual =
    Provider<casodeusoobtenerperfilusuarioactual>(
      (ref) => casodeusoobtenerperfilusuarioactual(
        ref.watch(proveedorpuertoautenticacion),
      ),
    );
