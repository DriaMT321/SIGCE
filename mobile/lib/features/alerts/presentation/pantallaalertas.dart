import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../../core/widgets/etiquetaestado.dart';
import '../../academic/domain/use_cases/consultasacademicas.dart';
import '../../academic/domain/entities/registrosacademicos.dart';
import '../../academic/domain/repositories/repositorioacademico.dart';

class pantallaalertas extends ConsumerStatefulWidget {
  const pantallaalertas({super.key, this.repositorio});

  final puertorepositorioacademico? repositorio;

  @override
  ConsumerState<pantallaalertas> createState() => _alertaspantallaestado();
}

class _alertaspantallaestado extends ConsumerState<pantallaalertas> {
  late final casoobteneralertasencache _obteneralertas;
  late Future<resultadoencache<List<resumendealerta>>> _futuroalertas;

  @override
  void initState() {
    super.initState();
    _obteneralertas = widget.repositorio == null
        ? ref.read(proveedorobteneralertasencache)
        : casoobteneralertasencache(widget.repositorio!);
    _cargaralertas();
  }

  void _cargaralertas() {
    _futuroalertas = _obteneralertas.ejecutar();
  }

  void _abrirdestino(int indice) {
    switch (indice) {
      case 0:
        context.go('/students');
      case 1:
        context.go('/assignments');
      case 2:
        context.go('/schedules');
      case 3:
        context.go('/announcements');
      case 4:
        context.go('/profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Alertas')),
      body: FutureBuilder<resultadoencache<List<resumendealerta>>>(
        future: _futuroalertas,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 14),
                  Semantics(
                    liveRegion: true,
                    child: const Text('Cargando alertas'),
                  ),
                ],
              ),
            );
          }
          if (snapshot.hasError) {
            return estadomensaje(
              icono: Icons.cloud_off_outlined,
              titulo: 'No se pudieron cargar las alertas.',
              mensaje: 'Comprueba la conexión e inténtalo de nuevo.',
              etiquetaaccion: 'Reintentar',
              alaccion: () => setState(_cargaralertas),
            );
          }

          final resultado = snapshot.data;
          final alertas = resultado?.datos ?? [];
          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargaralertas);
              await _futuroalertas;
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
              children: [
                const introduccionpagina(
                  titulo: 'Seguimiento académico',
                  descripcion: 'Avisos importantes sobre tus estudiantes.',
                ),
                if (resultado?.estaoffline ?? false) ...[
                  avisosinconexion(
                    fechaactualizacion:
                        resultado?.fechaactualizacionformateada ??
                        'Caché local',
                  ),
                  const SizedBox(height: 14),
                ],
                if (alertas.isEmpty)
                  const SizedBox(
                    height: 240,
                    child: estadomensaje(
                      icono: Icons.check_circle_outline,
                      titulo: 'Sin alertas pendientes.',
                      mensaje:
                          'Te avisaremos cuando haya novedades en calificaciones o asistencia.',
                    ),
                  )
                else
                  ...alertas.map(
                    (alerta) => _construirtarjetaalerta(context, alerta),
                  ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 3,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _construirtarjetaalerta(
    BuildContext context,
    resumendealerta alerta,
  ) {
    final (background, foreground, label, icon) = switch (alerta.gravedad) {
      'CRITICAL' => (
        temaaplicacion.fondoerror,
        temaaplicacion.error,
        'Crítica',
        Icons.error_outline,
      ),
      'WARNING' => (
        temaaplicacion.fondoadvertencia,
        temaaplicacion.advertencia,
        'Atención',
        Icons.warning_amber_outlined,
      ),
      _ => (
        temaaplicacion.fondomarca,
        temaaplicacion.marca,
        'Informativa',
        Icons.info_outline,
      ),
    };

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 19, color: foreground),
                const SizedBox(width: 8),
                etiquetaestado(
                  etiqueta: label,
                  colortexto: foreground,
                  colorfondo: background,
                ),
                const Spacer(),
                Text(
                  _formatearfecha(alerta.fechacreacion),
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ],
            ),
            const SizedBox(height: 13),
            Text(alerta.titulo, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 5),
            Text(alerta.mensaje, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }

  String _formatearfecha(DateTime fecha) =>
      '${fecha.day.toString().padLeft(2, '0')}/${fecha.month.toString().padLeft(2, '0')}/${fecha.year}';
}
