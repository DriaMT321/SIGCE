import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../academic/domain/entities/registrosacademicos.dart';

class pantallatareas extends ConsumerStatefulWidget {
  const pantallatareas({super.key});

  @override
  ConsumerState<pantallatareas> createState() => _pantallatareasestado();
}

class _pantallatareasestado extends ConsumerState<pantallatareas> {
  late Future<resultadoencache<List<resumendeasignacion>>> _futuroasignaciones;
  String _filtro = 'TODAS'; // TODAS, PENDIENTES, EXAMENES, PRACTICOS

  @override
  void initState() {
    super.initState();
    _cargartareas();
  }

  void _cargartareas() {
    _futuroasignaciones =
        ref.read(proveedorobtenerasignacionesencache).ejecutar();
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
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm', 'es');

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
            const Text('Tareas y Evaluaciones'),
          ],
        ),
      ),
      body: FutureBuilder<resultadoencache<List<resumendeasignacion>>>(
        future: _futuroasignaciones,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return estadomensaje(
              icono: Icons.assignment_outlined,
              titulo: 'No se pudieron cargar las tareas.',
              mensaje: 'Verifique su conexión e intente nuevamente.',
              etiquetaaccion: 'Reintentar',
              alaccion: () => setState(_cargartareas),
            );
          }

          final cache = snapshot.data!;
          final todas = cache.datos;

          final filtradas = todas.where((a) {
            if (_filtro == 'PENDIENTES') return a.espendiente;
            if (_filtro == 'EXAMENES') return a.tipo == 'EXAMEN';
            if (_filtro == 'PRACTICOS') {
              return a.tipo == 'TRABAJO_PRACTICO' || a.tipo == 'PROYECTO';
            }
            return true;
          }).toList();

          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargartareas);
              await _futuroasignaciones;
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
              children: [
                const introduccionpagina(
                  titulo: 'Actividades Académicas',
                  descripcion:
                      'Revisa las tareas, trabajos prácticos y exámenes programados.',
                ),
                if (cache.estaoffline) ...[
                  avisosinconexion(
                    fechaactualizacion: cache.fechaactualizacionformateada,
                  ),
                  const SizedBox(height: 12),
                ],
                // Chips de filtro
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _filtroChip('TODAS', 'Todas (${todas.length})'),
                      const SizedBox(width: 8),
                      _filtroChip(
                        'PENDIENTES',
                        'Pendientes (${todas.where((a) => a.espendiente).length})',
                      ),
                      const SizedBox(width: 8),
                      _filtroChip(
                        'EXAMENES',
                        'Exámenes (${todas.where((a) => a.tipo == 'EXAMEN').length})',
                      ),
                      const SizedBox(width: 8),
                      _filtroChip('PRACTICOS', 'Prácticos / Proyectos'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                if (filtradas.isEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 40),
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        Icon(
                          Icons.check_circle_outline,
                          size: 48,
                          color: temaaplicacion.exito.withOpacity(0.7),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'No hay tareas pendientes en esta sección.',
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
                  ...filtradas.map(
                    (tarea) => _construirTarjetaTarea(tarea, dateFormat),
                  ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 1,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _filtroChip(String clave, String label) {
    final isSel = _filtro == clave;
    return ChoiceChip(
      label: Text(label),
      selected: isSel,
      selectedColor: temaaplicacion.fondomarca,
      labelStyle: TextStyle(
        color: isSel ? temaaplicacion.marca : temaaplicacion.tinta,
        fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
        fontSize: 12,
      ),
      onSelected: (_) => setState(() => _filtro = clave),
    );
  }

  Widget _construirTarjetaTarea(
    resumendeasignacion tarea,
    DateFormat dateFormat,
  ) {
    final esExamen = tarea.tipo == 'EXAMEN';
    final esUrgente = tarea.esvencida;

    Color badgeColor = temaaplicacion.marca;
    Color badgeFondo = temaaplicacion.fondomarca;

    if (esExamen) {
      badgeColor = const Color(0xFFBE123C);
      badgeFondo = const Color(0xFFFFE4E6);
    } else if (tarea.tipo == 'TRABAJO_PRACTICO') {
      badgeColor = temaaplicacion.secundario;
      badgeFondo = temaaplicacion.fondosecundario;
    }

    String fechaStr;
    try {
      fechaStr = dateFormat.format(tarea.fechalimite);
    } catch (_) {
      fechaStr = tarea.fechalimite.toString();
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: esUrgente ? temaaplicacion.error : temaaplicacion.borde,
          width: esUrgente ? 1.5 : 1,
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
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Fila superior: Materia + Tipo chip
            Row(
              children: [
                Expanded(
                  child: Text(
                    tarea.nombremateria,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: temaaplicacion.tintatenue,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: badgeFondo,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    tarea.tiponormalizado,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: badgeColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            // Título de la tarea
            Text(
              tarea.titulo,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: temaaplicacion.tinta,
              ),
            ),
            if (tarea.descripcion.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                tarea.descripcion,
                style: const TextStyle(
                  fontSize: 13,
                  color: temaaplicacion.tintatenue,
                  height: 1.35,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 12),
            const Divider(height: 1, color: temaaplicacion.borde),
            const SizedBox(height: 10),
            // Fila inferior: Fecha límite, Puntaje y Docente / Estudiante
            Row(
              children: [
                Icon(
                  Icons.schedule,
                  size: 14,
                  color: esUrgente
                      ? temaaplicacion.error
                      : temaaplicacion.tintatenue,
                ),
                const SizedBox(width: 4),
                Text(
                  fechaStr,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: esUrgente ? FontWeight.w800 : FontWeight.w600,
                    color: esUrgente
                        ? temaaplicacion.error
                        : temaaplicacion.tintatenue,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 7,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text(
                    '${tarea.puntajemaximo.toInt()} pts',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: temaaplicacion.tinta,
                    ),
                  ),
                ),
              ],
            ),
            if (tarea.nombreestudiante != null) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(
                    Icons.face_outlined,
                    size: 13,
                    color: temaaplicacion.marca,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Alumno: ${tarea.nombreestudiante}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: temaaplicacion.marca,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
