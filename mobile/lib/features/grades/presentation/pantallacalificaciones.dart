import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../academic/domain/use_cases/consultasacademicas.dart';
import '../../academic/domain/entities/registrosacademicos.dart';
import '../../academic/domain/repositories/repositorioacademico.dart';
import '../../academic/presentation/periodosopcionales.dart';

class pantallacalificaciones extends ConsumerStatefulWidget {
  const pantallacalificaciones({
    super.key,
    required this.identificadorestudiante,
    this.repositorio,
  });

  final String identificadorestudiante;
  final puertorepositorioacademico? repositorio;

  @override
  ConsumerState<pantallacalificaciones> createState() =>
      _calificacionespantallaestado();
}

class _calificacionespantallaestado
    extends ConsumerState<pantallacalificaciones> {
  late final casoobtenercalificacionesencache _obtenercalificaciones;
  late Future<
    (
      resultadoencache<List<resumendecalificacion>>,
      resultadoencache<List<periodoacademico>>,
    )
  >
  _futurocalificaciones;
  String? _gestionid;
  String? _periodoid;

  @override
  void initState() {
    super.initState();
    _obtenercalificaciones = widget.repositorio == null
        ? ref.read(proveedorobtenercalificacionesencache)
        : casoobtenercalificacionesencache(widget.repositorio!);
    _cargarcalificaciones();
  }

  void _cargarcalificaciones() {
    final puertorepositorioacademico repo =
        widget.repositorio ?? ref.read(proveedorrepositorioacademico);
    _futurocalificaciones = (
      _obtenercalificaciones.ejecutar(
        identificadorestudiante: widget.identificadorestudiante,
      ),
      obtenerperiodosopcionales(repo),
    ).wait;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Boletín de calificaciones')),
      body:
          FutureBuilder<
            (
              resultadoencache<List<resumendecalificacion>>,
              resultadoencache<List<periodoacademico>>,
            )
          >(
            future: _futurocalificaciones,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                return estadomensaje(
                  icono: Icons.cloud_off_outlined,
                  titulo: 'No se pudieron cargar las calificaciones.',
                  mensaje: 'Comprueba la conexión e inténtalo de nuevo.',
                  etiquetaaccion: 'Reintentar',
                  alaccion: () => setState(_cargarcalificaciones),
                );
              }

              final resultado = snapshot.data!.$1;
              final periodosresultado = snapshot.data!.$2;
              final todas = resultado.datos;
              final periodos = periodosresultado.datos;
              final gestiones = <String, periodoacademico>{};
              for (final periodo in periodos) {
                gestiones[periodo.gestionid] = periodo;
              }
              final opciones = gestiones.values.toList()
                ..sort((a, b) => b.gestion.compareTo(a.gestion));
              final idsperiodos = periodos.map((p) => p.identificador).toSet();
              final haydesconocidos = todas.any(
                (c) => !idsperiodos.contains(c.identificadorperiodo),
              );
              final activa = opciones.where((p) => p.gestionactiva);
              final gestion = _gestionid == 'desconocida' && haydesconocidos
                  ? 'desconocida'
                  : gestiones.containsKey(_gestionid)
                  ? _gestionid
                  : activa.isNotEmpty
                  ? activa.first.gestionid
                  : opciones.isNotEmpty
                  ? opciones.first.gestionid
                  : haydesconocidos
                  ? 'desconocida'
                  : null;
              final periodosgestion =
                  periodos.where((p) => p.gestionid == gestion).toList()
                    ..sort((a, b) => a.inicio.compareTo(b.inicio));
              final idsvisibles = periodosgestion
                  .map((p) => p.identificador)
                  .toSet();
              final periodo = idsvisibles.contains(_periodoid)
                  ? _periodoid
                  : null;
              final calificaciones = todas
                  .where(
                    (c) => gestion == 'desconocida'
                        ? !idsperiodos.contains(c.identificadorperiodo)
                        : idsvisibles.contains(c.identificadorperiodo) &&
                              (periodo == null ||
                                  c.identificadorperiodo == periodo),
                  )
                  .toList();
              final issinconexion =
                  resultado.estaoffline || periodosresultado.estaoffline;

              return RefreshIndicator(
                onRefresh: () async {
                  setState(_cargarcalificaciones);
                  await _futurocalificaciones;
                },
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 18, 20, 26),
                  children: [
                    introduccionpagina(
                      titulo: 'Resultados por asignatura',
                      descripcion: todas.isEmpty
                          ? 'Las calificaciones registradas aparecerán aquí.'
                          : todas.first.nombreestudiante,
                    ),
                    if (issinconexion) ...[
                      avisosinconexion(
                        fechaactualizacion:
                            resultado.estaoffline &&
                                !periodosresultado.estaoffline
                            ? resultado.fechaactualizacionformateada
                            : 'Los registros o períodos pueden no estar actualizados',
                      ),
                      const SizedBox(height: 14),
                    ],
                    if (gestion != null) ...[
                      DropdownButtonFormField<String>(
                        initialValue: gestion,
                        decoration: const InputDecoration(
                          labelText: 'Gestión académica',
                        ),
                        items: [
                          ...opciones.map(
                            (p) => DropdownMenuItem(
                              value: p.gestionid,
                              child: Text('${p.gestion}'),
                            ),
                          ),
                          if (haydesconocidos)
                            const DropdownMenuItem(
                              value: 'desconocida',
                              child: Text('Sin gestión identificada'),
                            ),
                        ],
                        onChanged: (valor) => setState(() {
                          _gestionid = valor;
                          _periodoid = null;
                        }),
                      ),
                      if (gestion != 'desconocida' &&
                          periodosgestion.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          key: ValueKey(gestion),
                          initialValue: periodo ?? '',
                          decoration: const InputDecoration(
                            labelText: 'Período',
                          ),
                          items: [
                            const DropdownMenuItem(
                              value: '',
                              child: Text('Todos los períodos'),
                            ),
                            ...periodosgestion.map(
                              (p) => DropdownMenuItem(
                                value: p.identificador,
                                child: Text(p.nombre),
                              ),
                            ),
                          ],
                          onChanged: (valor) => setState(
                            () => _periodoid = valor?.isEmpty == true
                                ? null
                                : valor,
                          ),
                        ),
                      ],
                      const SizedBox(height: 14),
                    ],
                    if (calificaciones.isEmpty)
                      const SizedBox(
                        height: 240,
                        child: estadomensaje(
                          icono: Icons.menu_book_outlined,
                          titulo: 'No hay calificaciones registradas para esta selección.',
                          mensaje: 'Desliza hacia abajo para actualizar la consulta.',
                        ),
                      )
                    else
                      ...calificaciones.map(_construircalificacion),
                  ],
                ),
              );
            },
          ),
    );
  }

  Widget _construircalificacion(resumendecalificacion calificacion) {
    final isaprobatoria = calificacion.estaaprobada;
    final notacolor = isaprobatoria
        ? temaaplicacion.exito
        : temaaplicacion.error;
    final notawash = isaprobatoria
        ? temaaplicacion.fondoexito
        : temaaplicacion.fondoerror;

    return Padding(
      padding: const EdgeInsets.only(bottom: 11),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      calificacion.materia,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${calificacion.nombreestudiante}  ·  ${calificacion.periodo}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Container(
                constraints: const BoxConstraints(minWidth: 64, minHeight: 48),
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: notawash,
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: Text(
                  '${calificacion.valor.toStringAsFixed(0)} pts',
                  semanticsLabel:
                      'Calificación ${calificacion.valor.toStringAsFixed(0)} puntos',
                  style: Theme.of(context).textTheme.labelLarge
                      ?.copyWith(color: notacolor, fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
