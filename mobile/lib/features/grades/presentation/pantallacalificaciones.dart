import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

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
  final Set<String> _materiasExpandidas = {};

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
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/brand/logo-sf.png',
              height: 28,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(Icons.school, size: 24),
            ),
            const SizedBox(width: 8),
            const Text('Boletín de Notas'),
          ],
        ),
      ),
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

              // Calcular promedio general
              final promedioGeneral = calificaciones.isNotEmpty
                  ? calificaciones.map((c) => c.valor).reduce((a, b) => a + b) / calificaciones.length
                  : 0.0;

              return RefreshIndicator(
                onRefresh: () async {
                  setState(_cargarcalificaciones);
                  await _futurocalificaciones;
                },
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(18, 14, 18, 26),
                  children: [
                    introduccionpagina(
                      titulo: 'Rendimiento Académico',
                      descripcion: todas.isEmpty
                          ? 'Las calificaciones registradas aparecerán aquí.'
                          : '${todas.first.nombreestudiante} · Gestión 2026',
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
                    // Tarjeta de promedio global
                    if (calificaciones.isNotEmpty) ...[
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF8B1820), Color(0xFFB91C1C)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x258B1820),
                              blurRadius: 8,
                              offset: Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.18),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.school, color: Colors.white, size: 28),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Promedio Trimestral',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    '${promedioGeneral.toStringAsFixed(1)} / 100 pts',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: promedioGeneral >= 51
                                    ? Colors.white.withOpacity(0.25)
                                    : Colors.red.shade900,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                promedioGeneral >= 51 ? 'Aprobado' : 'En riesgo',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                    ],
                    // Filtros de Gestión y Período
                    if (gestion != null) ...[
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              initialValue: gestion,
                              decoration: const InputDecoration(
                                labelText: 'Gestión',
                                contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                              ),
                              items: [
                                ...opciones.map(
                                  (p) => DropdownMenuItem(
                                    value: p.gestionid,
                                    child: Text('${p.gestion}', style: const TextStyle(fontSize: 13)),
                                  ),
                                ),
                                if (haydesconocidos)
                                  const DropdownMenuItem(
                                    value: 'desconocida',
                                    child: Text('Sin gestión'),
                                  ),
                              ],
                              onChanged: (valor) => setState(() {
                                _gestionid = valor;
                                _periodoid = null;
                              }),
                            ),
                          ),
                          if (gestion != 'desconocida' && periodosgestion.isNotEmpty) ...[
                            const SizedBox(width: 10),
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                key: ValueKey(gestion),
                                initialValue: periodo ?? '',
                                decoration: const InputDecoration(
                                  labelText: 'Trimestre',
                                  contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                                ),
                                items: [
                                  const DropdownMenuItem(
                                    value: '',
                                    child: Text('Todos', style: TextStyle(fontSize: 13)),
                                  ),
                                  ...periodosgestion.map(
                                    (p) => DropdownMenuItem(
                                      value: p.identificador,
                                      child: Text(p.nombre, style: const TextStyle(fontSize: 13)),
                                    ),
                                  ),
                                ],
                                onChanged: (valor) => setState(
                                  () => _periodoid = valor?.isEmpty == true ? null : valor,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
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
    final notacolor = isaprobatoria ? temaaplicacion.exito : temaaplicacion.error;
    final notawash = isaprobatoria ? temaaplicacion.fondoexito : temaaplicacion.fondoerror;
    final estaExpandida = _materiasExpandidas.contains(calificacion.materia + calificacion.periodo);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: temaaplicacion.borde),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () {
              final key = calificacion.materia + calificacion.periodo;
              setState(() {
                if (_materiasExpandidas.contains(key)) {
                  _materiasExpandidas.remove(key);
                } else {
                  _materiasExpandidas.add(key);
                }
              });
            },
            borderRadius: BorderRadius.circular(14),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          calificacion.materia,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: temaaplicacion.tinta,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          calificacion.periodo,
                          style: const TextStyle(
                            fontSize: 12,
                            color: temaaplicacion.tintatenue,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    constraints: const BoxConstraints(minWidth: 64, minHeight: 44),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: notawash,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '${calificacion.valor.toStringAsFixed(0)} pts',
                      style: TextStyle(
                        color: notacolor,
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Icon(
                    estaExpandida ? Icons.expand_less : Icons.expand_more,
                    color: temaaplicacion.tintatenue,
                  ),
                ],
              ),
            ),
          ),
          if (estaExpandida) ...[
            const Divider(height: 1, color: temaaplicacion.borde),
            Container(
              padding: const EdgeInsets.all(14),
              color: const Color(0xFFF8FAFC),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Desglose y Criterios de Evaluación',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: temaaplicacion.tinta,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Dimensiones del modelo educativo boliviano (Ser, Saber, Hacer, Decidir)
                  _dimensionRow('Saber y Conocimientos (45 pts)', (calificacion.valor * 0.45).toStringAsFixed(0)),
                  _dimensionRow('Hacer y Trabajos Prácticos (40 pts)', (calificacion.valor * 0.40).toStringAsFixed(0)),
                  _dimensionRow('Ser y Decidir / Valores (10 pts)', (calificacion.valor * 0.10).toStringAsFixed(0)),
                  _dimensionRow('Autoevaluación del Estudiante (5 pts)', (calificacion.valor * 0.05).toStringAsFixed(0)),
                  if (calificacion.observaciones != null && calificacion.observaciones!.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      'Observación del Docente: ${calificacion.observaciones}',
                      style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: temaaplicacion.tintatenue),
                    ),
                  ],
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.assignment_outlined, size: 16),
                      label: const Text('Ver tareas de esta materia', style: TextStyle(fontSize: 12)),
                      onPressed: () => context.push('/assignments'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _dimensionRow(String label, String valor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: temaaplicacion.tintatenue)),
          Text('$valor pts', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: temaaplicacion.tinta)),
        ],
      ),
    );
  }
}
