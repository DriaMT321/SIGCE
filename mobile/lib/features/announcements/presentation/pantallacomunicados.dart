import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../academic/domain/entities/registrosacademicos.dart';

class pantallacomunicados extends ConsumerStatefulWidget {
  const pantallacomunicados({super.key});

  @override
  ConsumerState<pantallacomunicados> createState() =>
      _pantallacomunicadosestado();
}

class _pantallacomunicadosestado extends ConsumerState<pantallacomunicados> {
  late Future<
    (
      resultadoencache<List<resumendecomunicado>>,
      resultadoencache<List<resumendealerta>>,
    )
  >
  _futurodatos;
  int _pestanaActiva = 0; // 0 = Comunicados, 1 = Alertas

  @override
  void initState() {
    super.initState();
    _cargardatos();
  }

  void _cargardatos() {
    final repo = ref.read(proveedorrepositorioacademico);
    _futurodatos = (
      repo.obtenercomunicadosencache(),
      repo.obteneralertasencache(),
    ).wait;
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

  String _formatearFechaHora(DateTime fecha) {
    final d = fecha.day.toString().padLeft(2, '0');
    final m = fecha.month.toString().padLeft(2, '0');
    final y = fecha.year.toString();
    final h = fecha.hour.toString().padLeft(2, '0');
    final min = fecha.minute.toString().padLeft(2, '0');
    return '$d/$m/$y $h:$min';
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
            const Text('Avisos y Comunicados'),
          ],
        ),
      ),
      body:
          FutureBuilder<
            (
              resultadoencache<List<resumendecomunicado>>,
              resultadoencache<List<resumendealerta>>,
            )
          >(
            future: _futurodatos,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                return estadomensaje(
                  icono: Icons.campaign_outlined,
                  titulo: 'No se pudieron cargar los comunicados.',
                  mensaje: 'Verifique su conexión e intente nuevamente.',
                  etiquetaaccion: 'Reintentar',
                  alaccion: () => setState(_cargardatos),
                );
              }

              final (comunicadosCache, alertasCache) = snapshot.data!;
              final comunicados = comunicadosCache.datos;
              final alertas = alertasCache.datos;
              final esOffline =
                  comunicadosCache.estaoffline || alertasCache.estaoffline;

              return RefreshIndicator(
                onRefresh: () async {
                  setState(_cargardatos);
                  await _futurodatos;
                },
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
                  children: [
                    const introduccionpagina(
                      titulo: 'Comunicación Institucional',
                      descripcion:
                          'Avisos oficiales de la Dirección y alertas de rendimiento.',
                    ),
                    if (esOffline) ...[
                      avisosinconexion(
                        fechaactualizacion:
                            comunicadosCache.fechaactualizacionformateada,
                      ),
                      const SizedBox(height: 12),
                    ],
                    // Segmented Selector
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: temaaplicacion.borde),
                      ),
                      padding: const EdgeInsets.all(4),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _pestanaActiva = 0),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                ),
                                decoration: BoxDecoration(
                                  color: _pestanaActiva == 0
                                      ? temaaplicacion.marca
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Comunicados (${comunicados.length})',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: _pestanaActiva == 0
                                        ? Colors.white
                                        : temaaplicacion.tintatenue,
                                    fontWeight: _pestanaActiva == 0
                                        ? FontWeight.w800
                                        : FontWeight.w600,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _pestanaActiva = 1),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                ),
                                decoration: BoxDecoration(
                                  color: _pestanaActiva == 1
                                      ? temaaplicacion.marca
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Alertas (${alertas.length})',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: _pestanaActiva == 1
                                        ? Colors.white
                                        : temaaplicacion.tintatenue,
                                    fontWeight: _pestanaActiva == 1
                                        ? FontWeight.w800
                                        : FontWeight.w600,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (_pestanaActiva == 0) ...[
                      if (comunicados.isEmpty)
                        _construirVacio('No hay comunicados oficiales activos.')
                      else
                        ...comunicados.map(
                          (c) => _construirTarjetaComunicado(c),
                        ),
                    ] else ...[
                      if (alertas.isEmpty)
                        _construirVacio(
                          'No tienes alertas de seguimiento activas.',
                        )
                      else
                        ...alertas.map(
                          (a) => _construirTarjetaAlerta(a),
                        ),
                    ],
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

  Widget _construirVacio(String mensaje) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 40),
      alignment: Alignment.center,
      child: Column(
        children: [
          Icon(
            Icons.notifications_off_outlined,
            size: 48,
            color: temaaplicacion.tintatenue.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 12),
          Text(
            mensaje,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: temaaplicacion.tintatenue,
            ),
          ),
        ],
      ),
    );
  }

  Widget _construirTarjetaComunicado(resumendecomunicado c) {
    final esUrgente = c.prioridad == 'URGENTE' || c.prioridad == 'ALTA';
    final fechaStr = _formatearFechaHora(c.fechacreacion);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: esUrgente
              ? temaaplicacion.marca.withValues(alpha: 0.4)
              : temaaplicacion.borde,
          width: esUrgente ? 1.4 : 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 7,
                    vertical: 2.5,
                  ),
                  decoration: BoxDecoration(
                    color: esUrgente
                        ? temaaplicacion.fondomarca
                        : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    c.prioridad,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: esUrgente
                          ? temaaplicacion.marca
                          : temaaplicacion.tintatenue,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  fechaStr,
                  style: const TextStyle(
                    fontSize: 11,
                    color: temaaplicacion.tintatenue,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              c.titulo,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: temaaplicacion.tinta,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              c.contenido,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF334155),
                height: 1.45,
              ),
            ),
            const SizedBox(height: 12),
            const Divider(height: 1, color: temaaplicacion.borde),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(
                  Icons.verified_outlined,
                  size: 13,
                  color: temaaplicacion.marca,
                ),
                const SizedBox(width: 4),
                Text(
                  c.autornombre,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: temaaplicacion.tintatenue,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _construirTarjetaAlerta(resumendealerta a) {
    final esCritica = a.gravedad == 'CRITICAL' || a.gravedad == 'HIGH';
    final fechaStr = _formatearFechaHora(a.fechacreacion);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: esCritica
              ? temaaplicacion.error.withValues(alpha: 0.4)
              : temaaplicacion.borde,
          width: esCritica ? 1.4 : 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  esCritica
                      ? Icons.warning_amber_rounded
                      : Icons.info_outline_rounded,
                  size: 18,
                  color: esCritica
                      ? temaaplicacion.error
                      : temaaplicacion.secundario,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    a.titulo,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: esCritica
                          ? temaaplicacion.error
                          : temaaplicacion.tinta,
                    ),
                  ),
                ),
                Text(
                  fechaStr,
                  style: const TextStyle(
                    fontSize: 11,
                    color: temaaplicacion.tintatenue,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              a.mensaje,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF334155),
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
