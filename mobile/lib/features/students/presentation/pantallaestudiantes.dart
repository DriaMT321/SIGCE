import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../academic/domain/use_cases/consultasacademicas.dart';
import '../../academic/domain/entities/registrosacademicos.dart';
import '../../academic/domain/repositories/repositorioacademico.dart';

class pantallaestudiantes extends ConsumerStatefulWidget {
  const pantallaestudiantes({super.key, this.repositorio});

  final puertorepositorioacademico? repositorio;

  @override
  ConsumerState<pantallaestudiantes> createState() =>
      _estudiantespantallaestado();
}

class _estudiantespantallaestado extends ConsumerState<pantallaestudiantes> {
  late final casoobtenerestudiantesencache _obtenerestudiantes;
  late Future<resultadoencache<List<resumendeestudiante>>> _futuroestudiantes;

  @override
  void initState() {
    super.initState();
    _obtenerestudiantes = widget.repositorio == null
        ? ref.read(proveedorobtenerestudiantesencache)
        : casoobtenerestudiantesencache(widget.repositorio!);
    _cargarestudiantes();
  }

  void _cargarestudiantes() {
    _futuroestudiantes = _obtenerestudiantes.ejecutar();
  }

  void _abrirdestino(int indice) {
    switch (indice) {
      case 0:
        context.go('/students');
      case 1:
        context.go('/alerts');
      case 2:
        context.go('/profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SIGCE')),
      body: FutureBuilder<resultadoencache<List<resumendeestudiante>>>(
        future: _futuroestudiantes,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _estadoerror(
              alreintentar: () => setState(_cargarestudiantes),
            );
          }
          final resultado = snapshot.data;
          final estudiantes = resultado?.datos ?? [];
          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargarestudiantes);
              await _futuroestudiantes;
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
              children: [
                const introduccionpagina(
                  titulo: 'Estudiantes vinculados',
                  descripcion: 'Consulta sus calificaciones y asistencia.',
                ),
                if (resultado?.estaoffline ?? false) ...[
                  avisosinconexion(
                    fechaactualizacion:
                        resultado?.fechaactualizacionformateada ??
                        'Caché local',
                  ),
                  const SizedBox(height: 12),
                ],
                if (estudiantes.isEmpty)
                  const SizedBox(
                    height: 240,
                    child: estadomensaje(
                      icono: Icons.school_outlined,
                      titulo: 'No tienes estudiantes asociados.',
                      mensaje: 'Cuando la institución vincule estudiantes a tu cuenta, aparecerán aquí.',
                    ),
                  )
                else
                  ...estudiantes.map(
                    (student) => _construirtarjetaestudiante(context, student),
                  ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 0,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _construirtarjetaestudiante(
    BuildContext contexto,
    resumendeestudiante estudiante,
  ) {
    final initial = estudiante.nombre.trim().isEmpty
        ? '?'
        : estudiante.nombre.trim().characters.first.toUpperCase();
    final tematexto = Theme.of(contexto).textTheme;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(17),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 23,
                  backgroundColor: temaaplicacion.fondomarca,
                  foregroundColor: temaaplicacion.marca,
                  child: Text(
                    initial,
                    style: tematexto.titleMedium?.copyWith(
                      color: temaaplicacion.marca,
                    ),
                  ),
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(estudiante.nombre, style: tematexto.titleMedium),
                      const SizedBox(height: 3),
                      Text(estudiante.nombrecurso, style: tematexto.bodyMedium),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            Text(
              'RUDE  ${estudiante.rude}',
              style: tematexto.labelSmall?.copyWith(
                color: temaaplicacion.tintatenue,
                letterSpacing: 0.25,
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.assessment_outlined, size: 18),
                    label: const Text('Calificaciones', maxLines: 1),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 7),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => contexto.push(
                      '/students/${estudiante.identificador}/grades',
                    ),
                  ),
                ),
                const SizedBox(width: 9),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.event_available_outlined, size: 18),
                    label: const Text('Asistencia', maxLines: 1),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 7),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => contexto.push(
                      '/students/${estudiante.identificador}/attendance',
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _estadoerror extends StatelessWidget {
  const _estadoerror({required this.alreintentar});

  final VoidCallback alreintentar;

  @override
  Widget build(BuildContext context) {
    return estadomensaje(
      icono: Icons.cloud_off_outlined,
      titulo: 'No se pudo cargar la información.',
      mensaje: 'Comprueba la conexión e inténtalo de nuevo.',
      etiquetaaccion: 'Reintentar',
      alaccion: alreintentar,
    );
  }
}
