import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/date_symbol_data_local.dart';

import './core/auth/estadosesionautenticacion.dart';
import './core/notifications/servicionotificaciones.dart';
import './core/theme/temaaplicacion.dart';
import './core/router/enrutadoraplicacion.dart';
import './core/storage/servicioalmacenamientoseguro.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await initializeDateFormatting('es', null);
  } catch (_) {}
  try {
    await servicionotificaciones().inicializar();
  } catch (_) {}
  await estadodesionautenticacion.instance.inicializar(
    seguroalmacenamientoservicio(),
  );
  runApp(const ProviderScope(child: aplicacionmovilacademica()));
}

class aplicacionmovilacademica extends StatelessWidget {
  const aplicacionmovilacademica({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'SIGCE - Colegio Comunidad Cristiana',
      debugShowCheckedModeBanner: false,
      theme: temaaplicacion.temaclara,
      routerConfig: enrutadoraplicacion,
    );
  }
}
