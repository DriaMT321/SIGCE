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

class pantallahorarios extends ConsumerStatefulWidget {
  const pantallahorarios({super.key});

  @override
  ConsumerState<pantallahorarios> createState() => _pantallahorariosestado();
}

class _pantallahorariosestado extends ConsumerState<pantallahorarios> {
  late Future<resultadoencache<horariomi>> _futurohorario;
  String _diasel = 'LUNES';
  int _hijoindice = 0;

  static const _dias = [
    ('LUNES', 'Lun'),
    ('MARTES', 'Mar'),
    ('MIERCOLES', 'Mié'),
    ('JUEVES', 'Jue'),
    ('VIERNES', 'Vie'),
  ];

  @override
  void initState() {
    super.initState();
    _cargarhorario();
  }

  void _cargarhorario() {
    _futurohorario = ref.read(proveedorobtenermihorarioencache).ejecutar();
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
            const Text('Horario Escolar'),
          ],
        ),
      ),
      body: FutureBuilder<resultadoencache<horariomi>>(
        future: _futurohorario,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return estadomensaje(
              icono: Icons.calendar_month_outlined,
              titulo: 'No se pudo cargar el horario.',
              mensaje: 'Verifique su conexión e intente nuevamente.',
              etiquetaaccion: 'Reintentar',
              alaccion: () => setState(_cargarhorario),
            );
          }

          final cache = snapshot.data!;
          final horario = cache.datos;
          final esPadre = horario.hijoshorarios.isNotEmpty;

          // Seleccionar sesiones según el rol
          List<sesionhorario> todasSesiones = horario.sesiones;
          String cursoNombre = horario.nombrecurso;

          if (esPadre) {
            if (_hijoindice >= horario.hijoshorarios.length) {
              _hijoindice = 0;
            }
            final hijoActual = horario.hijoshorarios[_hijoindice];
            todasSesiones = hijoActual.sesiones;
            cursoNombre = '${hijoActual.nombreestudiante} · ${hijoActual.nombrecurso}';
          }

          final sesionesDelDia = todasSesiones
              .where((s) => s.diasemana.toUpperCase() == _diasel)
              .toList()
            ..sort((a, b) => a.periodoindice.compareTo(b.periodoindice));

          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargarhorario);
              await _futurohorario;
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
              children: [
                introduccionpagina(
                  titulo: 'Horario Semanal',
                  descripcion: cursoNombre,
                ),
                if (cache.estaoffline) ...[
                  avisosinconexion(
                    fechaactualizacion: cache.fechaactualizacionformateada,
                  ),
                  const SizedBox(height: 12),
                ],
                // Selector de hijo si es padre de familia con varios alumnos
                if (esPadre && horario.hijoshorarios.length > 1) ...[
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: List.generate(horario.hijoshorarios.length, (idx) {
                        final hijo = horario.hijoshorarios[idx];
                        final isSel = idx == _hijoindice;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(hijo.nombreestudiante),
                            selected: isSel,
                            selectedColor: temaaplicacion.fondomarca,
                            labelStyle: TextStyle(
                              color: isSel ? temaaplicacion.marca : temaaplicacion.tinta,
                              fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                            ),
                            onSelected: (_) => setState(() => _hijoindice = idx),
                          ),
                        );
                      }),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],
                // Selector de días (Lunes a Viernes)
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: temaaplicacion.borde),
                  ),
                  padding: const EdgeInsets.all(5),
                  child: Row(
                    children: _dias.map((d) {
                      final isSel = d.$1 == _diasel;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _diasel = d.$1),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 9),
                            decoration: BoxDecoration(
                              color: isSel ? temaaplicacion.marca : Colors.transparent,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              d.$2,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: isSel ? Colors.white : temaaplicacion.tintatenue,
                                fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),
                if (sesionesDelDia.isEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        Icon(Icons.event_busy_outlined, size: 48, color: temaaplicacion.tintatenue.withOpacity(0.5)),
                        const SizedBox(height: 12),
                        Text(
                          'Sin clases programadas este día',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: temaaplicacion.tintatenue,
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  ...sesionesDelDia.map(_construirTarjetaSesion),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 2,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _construirTarjetaSesion(sesionhorario s) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: temaaplicacion.borde),
        boxShadow: const [
          BoxShadow(
            color: Color(0x07000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              width: 5,
              decoration: const BoxDecoration(
                color: temaaplicacion.marca,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    // Columna de hora
                    SizedBox(
                      width: 82,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            s.horainicio,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                              color: temaaplicacion.tinta,
                            ),
                          ),
                          Text(
                            s.horafin,
                            style: const TextStyle(
                              fontSize: 12,
                              color: temaaplicacion.tintatenue,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: temaaplicacion.fondomarca,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'P.${s.periodoindice}',
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: temaaplicacion.marca,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const VerticalDivider(width: 18, thickness: 1, color: temaaplicacion.borde),
                    // Detalle de materia y docente
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.materia,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 15,
                              color: temaaplicacion.tinta,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              const Icon(Icons.person_outline, size: 14, color: temaaplicacion.tintatenue),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  s.docente,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: temaaplicacion.tintatenue,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          if (s.aula != null && s.aula!.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(Icons.room_outlined, size: 14, color: temaaplicacion.tintatenue),
                                const SizedBox(width: 4),
                                Text(
                                  'Aula: ${s.aula}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: temaaplicacion.tintatenue,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
