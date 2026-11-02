import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import './core/auth/estadosesionautenticacion.dart';
import './core/theme/temaaplicacion.dart';
import './core/router/enrutadoraplicacion.dart';
import './core/storage/servicioalmacenamientoseguro.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
      title: 'Portal Académico Familiar',
      debugShowCheckedModeBanner: false,
      theme: temaaplicacion.temaclara,
      routerConfig: enrutadoraplicacion,
    );
  }
}
