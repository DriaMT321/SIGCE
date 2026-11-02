import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../../core/widgets/etiquetaestado.dart';
import '../../academic/domain/use_cases/consultasacademicas.dart';
import '../../academic/domain/entities/registrosacademicos.dart';
import '../../academic/domain/repositories/repositorioacademico.dart';
import '../../academic/presentation/periodosopcionales.dart';

class pantallaasistencia extends ConsumerStatefulWidget {
  const pantallaasistencia({
    super.key,
    required this.identificadorestudiante,
    this.repositorio,
  });

  final String identificadorestudiante;
  final puertorepositorioacademico? repositorio;

  @override
  ConsumerState<pantallaasistencia> createState() =>
      _asistenciapantallaestado();
}

class _asistenciapantallaestado extends ConsumerState<pantallaasistencia> {
  late final casoobtenerasistenciaencache _obtenerasistencia;
  late Future<
    (
      resultadoencache<List<resumendeasistencia>>,
      resultadoencache<List<periodoacademico>>,
    )
  >
  _futuroasistencia;
  String? _periodoid;

  @override
  void initState() {
    super.initState();
    _obtenerasistencia = widget.repositorio == null
        ? ref.read(proveedorobtenerasistenciaencache)
        : casoobtenerasistenciaencache(widget.repositorio!);
    _cargarasistencia();
  }

  void _cargarasistencia() {
    final puertorepositorioacademico repo =
        widget.repositorio ?? ref.read(proveedorrepositorioacademico);
    _futuroasistencia = (
      _obtenerasistencia.ejecutar(
        identificadorestudiante: widget.identificadorestudiante,
      ),
      obtenerperiodosopcionales(repo),
    ).wait;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Registro de asistencia')),
      body:
          FutureBuilder<
            (
              resultadoencache<List<resumendeasistencia>>,
              resultadoencache<List<periodoacademico>>,
            )
          >(
            future: _futuroasistencia,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                return estadomensaje(
                  icono: Icons.cloud_off_outlined,
                  titulo: 'No se pudo cargar la asistencia.',
                  mensaje: 'Comprueba la conexión e inténtalo de nuevo.',
                  etiquetaaccion: 'Reintentar',
                  alaccion: () => setState(_cargarasistencia),
                );
              }

              final resultado = snapshot.data!.$1;
              final periodosresultado = snapshot.data!.$2;
              final todos = resultado.datos;
              final periodos = [...periodosresultado.datos]
                ..sort((a, b) => b.inicio.compareTo(a.inicio));
              final ahora = DateTime.now();
              final actual = periodos.where(
                (p) => p.gestionactiva && p.contiene(ahora),
              );
              final seleccion = periodos.where(
                (p) => p.identificador == _periodoid,
              );
              final periodo = seleccion.isNotEmpty
                  ? seleccion.first
                  : actual.isNotEmpty
                  ? actual.first
                  : periodos.isNotEmpty
                  ? periodos.first
                  : null;
              final sinperiodo = todos
                  .where(
                    (r) => !periodos.any(
                      (p) =>
                          p.gestionid == r.identificadorgestion &&
                          p.contiene(r.fecha),
                    ),
                  )
                  .toList();
              final versinperiodo =
                  (_periodoid == 'sinperiodo' || periodo == null) &&
                  sinperiodo.isNotEmpty;
              final records = versinperiodo
                  ? sinperiodo
                  : periodo == null
                  ? <resumendeasistencia>[]
                  : todos
                        .where(
                          (r) =>
                              r.identificadorgestion == periodo.gestionid &&
                              periodo.contiene(r.fecha),
                        )
                        .toList();
              final ausencias = records
                  .where((r) => r.estado == 'ABSENT' || r.estado == 'JUSTIFIED')
                  .length;
              final justificadas = records
                  .where((r) => r.estado == 'JUSTIFIED')
                  .length;
              return RefreshIndicator(
                onRefresh: () async {
                  setState(_cargarasistencia);
                  await _futuroasistencia;
                },
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
                  children: [
                    introduccionpagina(
                      titulo: 'Historial de asistencia',
                      descripcion: todos.isEmpty
                          ? 'Registros de asistencia del estudiante.'
                          : todos.first.nombreestudiante,
                    ),
                    if (resultado.estaoffline ||
                        periodosresultado.estaoffline) ...[
                      const avisosinconexion(
                        fechaactualizacion: 'Los registros o períodos pueden no estar actualizados',
                      ),
                      const SizedBox(height: 12),
                    ],
                    if (periodo == null && sinperiodo.isEmpty)
                      const Text('No hay períodos académicos configurados.')
                    else ...[
                      DropdownButtonFormField<String>(
                        initialValue: versinperiodo
                            ? 'sinperiodo'
                            : periodo!.identificador,
                        decoration: const InputDecoration(labelText: 'Período'),
                        items: [
                          ...periodos.map(
                            (p) => DropdownMenuItem(
                              value: p.identificador,
                              child: Text('${p.nombre} · ${p.gestion}'),
                            ),
                          ),
                          if (sinperiodo.isNotEmpty)
                            const DropdownMenuItem(
                              value: 'sinperiodo',
                              child: Text('Sin período identificado'),
                            ),
                        ],
                        onChanged: (valor) =>
                            setState(() => _periodoid = valor),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Ausencias registradas: $ausencias',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text('Justificadas: $justificadas'),
                      const SizedBox(height: 12),
                    ],
                    if ((periodo != null || versinperiodo) && records.isEmpty)
                      const SizedBox(
                        height: 240,
                        child: estadomensaje(
                          icono: Icons.event_busy_outlined,
                          titulo:
                              'No hay registros de asistencia en este período.',
                          mensaje: 'Desliza hacia abajo para actualizar la consulta.',
                        ),
                      )
                    else if (periodo != null || versinperiodo)
                      ...records.map(_construirregistro),
                  ],
                ),
              );
            },
          ),
    );
  }

  Widget _construirregistro(resumendeasistencia registro) {
    final (label, foreground, background) = switch (registro.estado) {
      'PRESENT' => (
        'PRESENTE',
        temaaplicacion.exito,
        temaaplicacion.fondoexito,
      ),
      'ABSENT' => ('AUSENTE', temaaplicacion.error, temaaplicacion.fondoerror),
      'LATE' => (
        'ATRASO',
        temaaplicacion.advertencia,
        temaaplicacion.fondoadvertencia,
      ),
      'JUSTIFIED' => (
        'JUSTIFICADO',
        temaaplicacion.marca,
        temaaplicacion.fondomarca,
      ),
      _ => (
        _etiquetaestado(registro.estado),
        temaaplicacion.tintatenue,
        temaaplicacion.lienzo,
      ),
    };

    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: temaaplicacion.lienzo,
                borderRadius: BorderRadius.circular(9),
              ),
              child: const Icon(
                Icons.calendar_today_outlined,
                size: 20,
                color: temaaplicacion.tintatenue,
              ),
            ),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _formatearfecha(registro.fecha),
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 3),
                  Text(
                    registro.nombreestudiante,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            etiquetaestado(
              etiqueta: label,
              colortexto: foreground,
              colorfondo: background,
            ),
          ],
        ),
      ),
    );
  }

  String _formatearfecha(DateTime fecha) =>
      '${fecha.day.toString().padLeft(2, '0')}/${fecha.month.toString().padLeft(2, '0')}/${fecha.year}';

  String _etiquetaestado(String estado) =>
      estado.replaceAll('_', ' ').toUpperCase();
}
